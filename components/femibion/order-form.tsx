'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, ChevronDown, Loader2, Truck } from 'lucide-react'
import { submitOrder } from '@/app/actions/orders'
import { trackEvent, trackMeta } from '@/lib/analytics'
import { getDeliveryFee, isTbilisi, searchCities } from '@/lib/georgia-cities'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/femibion/cart'
import { QtyStepper } from '@/components/femibion/qty-stepper'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type OrderTexts = {
  title: string
  subtitle: string
  shippingInfo?: string
  nameLabel: string
  namePlaceholder: string
  phoneLabel: string
  addressLabel: string
  productLabel: string
  quantityUnit: string
  productHint: string
  submitButton: string
  successTitle: string
  successMessage: string
  newOrderButton: string
}

type Field = 'name' | 'phone' | 'city' | 'street' | 'items' | 'terms'
type Errors = Partial<Record<Field, string>>

type PlacedOrder = {
  name: string
  phone: string
  lines: Array<{ name: string; qty: number; sum: number }>
  fee: number
  total: number
}

const inputClass =
  'h-12 w-full rounded-[12px] border-[1.5px] border-input bg-white px-3.5 text-base text-foreground placeholder:text-[#8d8496] transition-[border-color,box-shadow] duration-150 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20 aria-[invalid=true]:border-destructive'

function formatPhone(digits: string) {
  return digits.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4')
}

export function OrderForm({ texts, preselectId }: { texts: OrderTexts; preselectId?: string }) {
  const { products, qty, count, subtotal, ready, setQty, clear } = useCart()
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const hasTrackedFormStart = useRef(false)
  const preselected = useRef(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [activeCity, setActiveCity] = useState(-1)
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)

  useEffect(() => {
    if (!ready || preselected.current || !preselectId) return
    preselected.current = true
    const product = products.find((p) => p.id === preselectId)
    if (product && product.inStock && !(qty[product.id] > 0)) setQty(product.id, 1)
  }, [ready, preselectId, products, qty, setQty])

  const lines = products
    .filter((p) => (qty[p.id] ?? 0) > 0)
    .map((p) => ({ product: p, qty: qty[p.id], sum: qty[p.id] * p.price }))
  const citySuggestions = useMemo(() => searchCities(city), [city])
  const cityKnown = city.trim().length >= 2
  const fee = cityKnown ? getDeliveryFee(city) : null
  const total = subtotal + (fee ?? 0)

  const handleFormStart = () => {
    if (hasTrackedFormStart.current) return
    hasTrackedFormStart.current = true
    trackEvent('form_start', { form_name: 'order_form' })
    trackMeta('InitiateCheckout')
  }

  const clearError = (field: Field) => {
    if (errors[field]) setErrors(({ [field]: _removed, ...rest }) => rest)
  }

  const validate = (): Errors => {
    const next: Errors = {}
    if (name.trim().length < 2) next.name = 'მიუთითეთ სახელი და გვარი.'
    if (!/^5\d{8}$/.test(phone)) next.phone = 'ნომერი უნდა იყოს 9 ციფრი და იწყებოდეს 5-ით, მაგ. 595 94 74 50.'
    if (!cityKnown) next.city = 'მიუთითეთ ქალაქი ან სოფელი.'
    if (street.trim().length < 3) next.street = 'მიუთითეთ ქუჩა, სახლის ნომერი და ბინა.'
    if (count === 0) next.items = texts.productHint || 'დაამატეთ მინიმუმ ერთი პროდუქტი.'
    if (!acceptedTerms) next.terms = 'შეკვეთისთვის საჭიროა თანხმობა წესებსა და კონფიდენციალურობის პოლიტიკაზე.'
    return next
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return
    const next = validate()
    setErrors(next)
    setServerError(null)
    const firstInvalid = (Object.keys(next) as Field[])[0]
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus()
      return
    }
    setConfirmOpen(true)
  }

  const placeOrder = async () => {
    if (isLoading || lines.length === 0) return
    setConfirmOpen(false)
    setIsLoading(true)
    setServerError(null)

    const items = lines.map(({ product, qty: q }) => ({
      productId: product.id,
      label: product.orderLabel,
      qty: q,
      unitPrice: product.price,
    }))
    const deliveryFee = getDeliveryFee(city.trim())
    const productsSum = items.reduce((s, i) => s + i.qty * i.unitPrice, 0)

    const result = await submitOrder({
      name,
      phone,
      city: city.trim(),
      address: street.trim(),
      shippingFee: deliveryFee,
      productsTotal: productsSum,
      total: productsSum + deliveryFee,
      items,
      acceptedTerms,
    })

    setIsLoading(false)
    if (!result.success) {
      setServerError(result.error || 'შეკვეთა ვერ გაიგზავნა. სცადეთ თავიდან ან დაგვირეკეთ.')
      return
    }

    const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
    trackEvent('form_submit', { form_name: 'order_form', total_items: totalItems })
    trackEvent('generate_lead', {
      form_name: 'order_form',
      total_items: totalItems,
      currency: 'GEL',
      value: productsSum + deliveryFee,
    })
    trackMeta(
      'Lead',
      { value: productsSum + deliveryFee, currency: 'GEL', content_name: 'order_form', num_items: totalItems },
      result.orderId
    )
    setPlaced({
      name: name.trim(),
      phone,
      lines: lines.map(({ product, qty: q, sum }) => ({ name: product.name, qty: q, sum })),
      fee: deliveryFee,
      total: productsSum + deliveryFee,
    })
    clear()
  }

  const selectCity = (value: string) => {
    setCity(value)
    setCityOpen(false)
    setActiveCity(-1)
    clearError('city')
  }

  const startNewOrder = () => {
    setPlaced(null)
    setName('')
    setPhone('')
    setCity('')
    setStreet('')
    setAcceptedTerms(false)
    setErrors({})
  }

  const listboxId = `${uid}-cities`
  const showSuggestions = cityOpen && citySuggestions.length > 0

  return (
    <section id="order" className="py-12 md:py-16" aria-labelledby="order-title">
      <div className="wrap">
        <div className="mb-6 grid max-w-[44rem] justify-items-start gap-2">
          <h2 id="order-title" className="section-heading">
            {texts.title}
          </h2>
          <p className="text-[17px] text-muted-foreground">{texts.subtitle}</p>
          {texts.shippingInfo && (
            <p className="mt-1 inline-flex items-start gap-2.5 rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[14px] leading-normal">
              <Truck className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary" aria-hidden />
              {texts.shippingInfo}
            </p>
          )}
        </div>

        {placed ? (
          <div className="panel-flat grid max-w-[40rem] justify-items-start gap-3.5 p-6 sm:p-8" role="status">
            <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-[26px] w-[26px]" aria-hidden />
            </span>
            <h3 className="text-[1.6rem] font-bold leading-tight">{texts.successTitle}</h3>
            <p className="text-muted-foreground">
              {texts.successMessage} ნომერი: +995 {formatPhone(placed.phone)}.
            </p>
            <ul className="grid gap-1 tabular-nums">
              {placed.lines.map((line) => (
                <li key={line.name}>
                  {line.name} × {line.qty} = {line.sum} ₾
                </li>
              ))}
              <li>მიწოდება: {placed.fee ? `${placed.fee} ₾` : 'უფასო'}</li>
              <li className="font-bold">სულ: {placed.total} ₾</li>
            </ul>
            <button type="button" onClick={startNewOrder} className="btn-ghost">
              {texts.newOrderButton}
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]"
          >
            <div className="panel-flat grid min-w-0 gap-[18px] p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldShell id={`${uid}-name`} label={texts.nameLabel} error={errors.name}>
                  <input
                    id={`${uid}-name`}
                    data-field="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      clearError('name')
                    }}
                    onFocus={handleFormStart}
                    placeholder={texts.namePlaceholder}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                    className={inputClass}
                  />
                </FieldShell>

                <FieldShell id={`${uid}-phone`} label={texts.phoneLabel} error={errors.phone}>
                  <div className="flex">
                    <span className="flex items-center rounded-l-[12px] border-[1.5px] border-r-0 border-input bg-background px-3 text-[15px] text-muted-foreground tabular-nums">
                      +995
                    </span>
                    <input
                      id={`${uid}-phone`}
                      data-field="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(e) => {
                        let digits = e.target.value.replace(/\D/g, '')
                        if (digits.length > 9 && digits.startsWith('995')) digits = digits.slice(3)
                        setPhone(digits.slice(0, 9))
                        clearError('phone')
                      }}
                      onFocus={handleFormStart}
                      placeholder="5XX XX XX XX"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
                      className={cn(inputClass, 'min-w-0 rounded-l-none tabular-nums')}
                    />
                  </div>
                </FieldShell>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldShell
                  id={`${uid}-city`}
                  label="ქალაქი ან სოფელი"
                  error={errors.city}
                  hint={
                    cityKnown && !errors.city
                      ? isTbilisi(city)
                        ? 'თბილისი: მიწოდება უფასოა, 1–3 სამუშაო დღე'
                        : `რეგიონი: მიწოდება ${getDeliveryFee(city)} ₾, 3–7 დღე`
                      : undefined
                  }
                >
                  <div className="relative">
                    <input
                      id={`${uid}-city`}
                      data-field="city"
                      role="combobox"
                      aria-expanded={showSuggestions}
                      aria-controls={listboxId}
                      aria-autocomplete="list"
                      aria-activedescendant={showSuggestions && activeCity >= 0 ? `${listboxId}-${activeCity}` : undefined}
                      autoComplete="off"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value)
                        setCityOpen(e.target.value.trim().length >= 3)
                        setActiveCity(-1)
                        clearError('city')
                        handleFormStart()
                      }}
                      onFocus={() => {
                        handleFormStart()
                        if (city.trim().length >= 3) setCityOpen(true)
                      }}
                      onBlur={() => window.setTimeout(() => setCityOpen(false), 120)}
                      onKeyDown={(e) => {
                        if (!showSuggestions) return
                        if (e.key === 'ArrowDown') {
                          e.preventDefault()
                          setActiveCity((i) => Math.min(i + 1, citySuggestions.length - 1))
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault()
                          setActiveCity((i) => Math.max(i - 1, 0))
                        } else if (e.key === 'Enter' && activeCity >= 0) {
                          e.preventDefault()
                          selectCity(citySuggestions[activeCity])
                        } else if (e.key === 'Escape') {
                          setCityOpen(false)
                        }
                      }}
                      placeholder="მაგ. თბილისი"
                      aria-invalid={!!errors.city}
                      aria-describedby={errors.city ? `${uid}-city-err` : cityKnown ? `${uid}-city-hint` : undefined}
                      className={cn(inputClass, 'pr-10')}
                    />
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" aria-hidden />
                    {showSuggestions && (
                      <ul
                        id={listboxId}
                        role="listbox"
                        aria-label="ქალაქები"
                        className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-[12px] border border-border bg-white py-1 shadow-[var(--shadow-panel)]"
                      >
                        {citySuggestions.map((c, i) => (
                          <li
                            key={c}
                            id={`${listboxId}-${i}`}
                            role="option"
                            aria-selected={i === activeCity}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => selectCity(c)}
                            className={cn(
                              'cursor-pointer px-3.5 py-2.5 text-[15px] transition-colors',
                              i === activeCity ? 'bg-accent' : 'hover:bg-background'
                            )}
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </FieldShell>

                <FieldShell id={`${uid}-street`} label={texts.addressLabel} error={errors.street}>
                  <input
                    id={`${uid}-street`}
                    data-field="street"
                    autoComplete="street-address"
                    value={street}
                    onChange={(e) => {
                      setStreet(e.target.value)
                      clearError('street')
                    }}
                    onFocus={handleFormStart}
                    placeholder="ქუჩა, სახლი, სართული, ბინა"
                    aria-invalid={!!errors.street}
                    aria-describedby={errors.street ? `${uid}-street-err` : undefined}
                    className={inputClass}
                  />
                </FieldShell>
              </div>

              <fieldset
                data-field="items"
                tabIndex={-1}
                aria-describedby={errors.items ? `${uid}-items-err` : undefined}
                className="grid min-w-0 gap-2.5 focus:outline-none"
              >
                <legend className="mb-2 text-[14px] font-semibold">{texts.productLabel}</legend>
                {products.length === 0 && (
                  <p className="text-[14px] text-muted-foreground">პროდუქტები დროებით მიუწვდომელია.</p>
                )}
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-0.5 rounded-[12px] border-[1.5px] border-border bg-white px-3 py-2.5 sm:grid-cols-[56px_minmax(0,1fr)_auto_auto]"
                  >
                    <div className="relative row-span-2 h-12 w-12 sm:row-span-1 sm:h-14 sm:w-14">
                      <Image src={product.image} alt="" fill sizes="56px" className="object-contain mix-blend-multiply" />
                    </div>
                    <div className="grid min-w-0 leading-snug">
                      <b className="text-[15.5px]">{product.name}</b>
                      <span className="text-[13px] text-muted-foreground">{product.subtitle}</span>
                    </div>
                    <span className="col-start-2 row-start-2 whitespace-nowrap text-[14px] font-semibold tabular-nums sm:col-start-auto sm:row-start-auto sm:text-[15px]">
                      {product.price} ₾
                    </span>
                    <div className="col-start-3 row-span-2 row-start-1 sm:col-start-auto sm:row-span-1 sm:row-start-auto">
                      <QtyStepper product={product} />
                    </div>
                  </div>
                ))}
                {errors.items && (
                  <p id={`${uid}-items-err`} className="text-[13.5px] text-destructive">
                    {errors.items}
                  </p>
                )}
              </fieldset>
            </div>

            <aside className="panel-flat grid content-start gap-3.5 p-6 lg:sticky lg:top-[92px]" aria-label="შეკვეთის ჯამი">
              <p className="text-[17px] font-bold">შეკვეთის ჯამი</p>
              <dl className="grid gap-2.5 text-[15px]">
                {lines.length === 0 ? (
                  <div className="text-muted-foreground">კალათა ცარიელია. დაამატე პროდუქტი მარცხნივ.</div>
                ) : (
                  lines.map(({ product, qty: q, sum }) => (
                    <div key={product.id} className="flex items-baseline justify-between gap-3">
                      <dt className="text-muted-foreground">
                        {product.name} × {q}
                      </dt>
                      <dd className="font-semibold tabular-nums">{sum} ₾</dd>
                    </div>
                  ))
                )}
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted-foreground">მიწოდება</dt>
                  <dd className="font-semibold tabular-nums">
                    {fee == null ? 'მიუთითე ქალაქი' : fee === 0 ? 'უფასო' : `${fee} ₾`}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 border-t border-border pt-3">
                  <dt className="font-bold">სულ</dt>
                  <dd className="text-[1.5rem] font-extrabold tabular-nums">{total} ₾</dd>
                </div>
              </dl>

              <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-normal text-muted-foreground">
                <input
                  type="checkbox"
                  data-field="terms"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked)
                    clearError('terms')
                  }}
                  aria-invalid={!!errors.terms}
                  aria-describedby={errors.terms ? `${uid}-terms-err` : undefined}
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-primary"
                />
                <span>
                  ვეთანხმები{' '}
                  <Link href="/terms" className="text-primary underline underline-offset-2">
                    წესებს
                  </Link>{' '}
                  და{' '}
                  <Link href="/privacy" className="text-primary underline underline-offset-2">
                    კონფიდენციალურობის პოლიტიკას
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p id={`${uid}-terms-err`} className="-mt-2 text-[13.5px] text-destructive">
                  {errors.terms}
                </p>
              )}

              {serverError && (
                <p role="alert" className="rounded-[12px] bg-destructive/10 px-3.5 py-2.5 text-[14px] text-destructive">
                  {serverError}
                </p>
              )}

              <button type="submit" disabled={isLoading} className="btn-primary w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    იგზავნება...
                  </>
                ) : count > 0 && fee != null ? (
                  <span>
                    {texts.submitButton} <span className="whitespace-nowrap">— {total} ₾</span>
                  </span>
                ) : (
                  texts.submitButton
                )}
              </button>
              <p className="text-[13px] leading-normal text-muted-foreground">
                ოპერატორი დაგირეკავს შეკვეთის დასადასტურებლად. გადახდა მიწოდებისას, ნაღდით ან ბარათით.
              </p>
            </aside>
          </form>
        )}

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent className="rounded-[22px]">
            <AlertDialogHeader>
              <AlertDialogTitle>გთხოვთ გაითვალისწინოთ</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    მოწოდებისას შეფუთვა შესაძლოა დაზიანებული იყოს, ამიტომ გთხოვთ, პროდუქტის მდგომარეობა
                    გადაამოწმოთ კურიერის თანდასწრებით.
                  </p>
                  <p>
                    თბილისში შეცვლა უფასოა. გაითვალისწინეთ, რომ კურიერის წასვლის შემდეგ დაბრუნების სერვისი
                    ფასიანია. თბილისი 6 ლარი, რეგიონი 15 ლარი.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="min-h-12 rounded-[14px]">გაუქმება</AlertDialogCancel>
              <button type="button" className="btn-primary" onClick={placeOrder}>
                დადასტურება
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  )
}

function FieldShell({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid min-w-0 content-start gap-1.5">
      <label htmlFor={id} className="text-[14px] font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="text-[13.5px] leading-snug text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] leading-snug text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
