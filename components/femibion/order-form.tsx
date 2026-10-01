'use client'

import { useMemo, useRef, useState } from 'react'
import { User, Phone, MapPin, Package, CheckCircle, Loader2, Truck, Building2 } from 'lucide-react'
import { submitOrder } from '@/app/actions/orders'
import { trackEvent } from '@/lib/analytics'
import { getDeliveryFee, searchCities } from '@/lib/georgia-cities'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type OrderProduct = {
  id?: string
  name: string
  orderLabel?: string
  price?: number
}

type OrderTexts = {
  title: string
  subtitle: string
  shippingInfo?: string
  nameLabel: string
  namePlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  addressLabel: string
  addressPlaceholder: string
  productLabel: string
  quantityUnit: string
  productHint: string
  submitButton: string
  termsNote: string
  successTitle: string
  successMessage: string
  newOrderButton: string
}

const inputClass =
  'w-full rounded-xl border border-border bg-background/75 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15'

export function OrderForm({
  texts,
  products,
  preselectId,
}: {
  texts: OrderTexts
  products: OrderProduct[]
  preselectId?: string
}) {
  const hasTrackedFormStart = useRef(false)
  const cityWrapRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [cityQuery, setCityQuery] = useState('')
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  const [cityOpen, setCityOpen] = useState(false)
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    preselectId ? { [preselectId]: 1 } : {}
  )
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const productLines = products.map((p, idx) => ({
    key: p.id ?? `product-${idx}`,
    label: p.orderLabel || p.name,
    price: typeof p.price === 'number' && p.price > 0 ? p.price : 0,
  }))

  const hasProducts = productLines.some((p) => (quantities[p.key] ?? 0) > 0)
  const citySuggestions = useMemo(() => searchCities(cityQuery), [cityQuery])

  const productsTotal = productLines.reduce(
    (sum, p) => sum + (quantities[p.key] ?? 0) * p.price,
    0
  )
  const shippingFee = city ? getDeliveryFee(city) : null
  const orderTotal = shippingFee != null ? productsTotal + shippingFee : null
  const showSummary = hasProducts && !!city

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasProducts || !city.trim() || !street.trim() || isLoading) return
    setError(null)
    setConfirmOpen(true)
  }

  const placeOrder = async () => {
    if (!hasProducts || !city.trim() || !street.trim() || isLoading) return
    setConfirmOpen(false)
    setIsLoading(true)
    setError(null)

    const items = productLines
      .map((p) => ({
        productId: p.key,
        label: p.label,
        qty: quantities[p.key] ?? 0,
        unitPrice: p.price,
      }))
      .filter((i) => i.qty > 0)

    const fee = getDeliveryFee(city)
    const productsSum = items.reduce((s, i) => s + i.qty * i.unitPrice, 0)

    const result = await submitOrder({
      name,
      phone,
      city: city.trim(),
      address: street.trim(),
      shippingFee: fee,
      productsTotal: productsSum,
      total: productsSum + fee,
      items,
    })

    setIsLoading(false)
    if (result.success) {
      const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
      trackEvent('form_submit', { form_name: 'order_form', total_items: totalItems })
      trackEvent('generate_lead', {
        form_name: 'order_form',
        total_items: totalItems,
        currency: 'GEL',
        value: productsSum + fee,
      })
      setIsSubmitted(true)
    } else {
      setError(result.error || 'შეცდომა')
    }
  }

  const handleFormStart = () => {
    if (hasTrackedFormStart.current) return
    hasTrackedFormStart.current = true
    trackEvent('form_start', { form_name: 'order_form' })
  }

  const selectCity = (value: string) => {
    setCity(value)
    setCityQuery(value)
    setCityOpen(false)
  }

  if (isSubmitted) {
    return (
      <section id="order" className="section-pad bg-background">
        <div className="wrap">
          <div className="mx-auto max-w-lg text-center">
            <div className="rounded-3xl border border-border/60 bg-card p-10 shadow-[var(--shadow-card)]">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mb-4 text-2xl font-bold">{texts.successTitle}</h2>
              <p className="mb-6 text-muted-foreground">{texts.successMessage}</p>
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setName('')
                  setPhone('')
                  setCity('')
                  setCityQuery('')
                  setStreet('')
                  setQuantities({})
                }}
                className="btn-primary cursor-pointer"
              >
                {texts.newOrderButton}
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="order" className="section-pad relative overflow-hidden border-y border-border/60 bg-secondary/55">
      <div className="absolute -right-32 top-16 h-80 w-80 rounded-full bg-accent/45 blur-3xl" aria-hidden />
      <div className="wrap">
        <div className="relative mb-12 text-center">
          <span className="eyebrow mb-4 justify-center">შეკვეთა</span>
          <h2 className="section-heading">{texts.title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{texts.subtitle}</p>
          {texts.shippingInfo && (
            <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-4 py-3 text-sm">
              <Truck className="h-5 w-5 shrink-0 text-accent-foreground" aria-hidden />
              {texts.shippingInfo}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="paper-card relative mx-auto max-w-xl rounded-[2rem] p-6 md:p-10"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                {texts.nameLabel}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={texts.namePlaceholder}
                  onFocus={handleFormStart}
                  className={`${inputClass} h-14 pl-12 pr-4`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                {texts.phoneLabel}
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <span className="absolute left-12 top-1/2 -translate-y-1/2 font-medium text-muted-foreground">
                  +995
                </span>
                <input
                  type="tel"
                  id="phone"
                  required
                  inputMode="numeric"
                  pattern="5[0-9]{8}"
                  maxLength={9}
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 9)
                    setPhone(digits)
                  }}
                  placeholder="5XXXXXXXX"
                  onFocus={handleFormStart}
                  className={`${inputClass} h-14 pl-24 pr-4`}
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium">{texts.addressLabel}</p>

              <div ref={cityWrapRef} className="relative mb-3">
                <label htmlFor="city" className="mb-2 block text-xs text-muted-foreground">
                  ქალაქი
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    id="city"
                    required
                    autoComplete="off"
                    value={cityQuery}
                    onChange={(e) => {
                      const v = e.target.value
                      setCityQuery(v)
                      if (city && v !== city) setCity('')
                      setCityOpen(v.trim().length >= 3)
                      handleFormStart()
                    }}
                    onFocus={() => {
                      handleFormStart()
                      if (cityQuery.trim().length >= 3) setCityOpen(true)
                    }}
                    onBlur={() => {
                      window.setTimeout(() => setCityOpen(false), 150)
                    }}
                    placeholder="ჩაწერე ქალაქი (მინ. 3 ასო)"
                    className={`${inputClass} h-14 pl-12 pr-4`}
                  />
                </div>
                {cityOpen && citySuggestions.length > 0 && (
                  <ul
                    className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-[var(--shadow-card)]"
                    role="listbox"
                  >
                    {citySuggestions.map((c) => (
                      <li key={c}>
                        <button
                          type="button"
                          className="w-full cursor-pointer px-4 py-2.5 text-left text-sm transition-colors hover:bg-secondary"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectCity(c)}
                        >
                          {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {cityQuery.trim().length >= 3 && citySuggestions.length === 0 && cityOpen && (
                  <p className="mt-2 text-xs text-muted-foreground">ქალაქი ვერ მოიძებნა</p>
                )}
                {city && (
                  <p className="mt-2 text-xs text-primary">
                    არჩეული: {city}
                    {getDeliveryFee(city) === 0
                      ? ' — მიწოდება უფასო'
                      : ` — მიწოდება ${getDeliveryFee(city)} ₾`}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="mb-2 block text-xs text-muted-foreground">
                  მისამართი
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                  <textarea
                    id="address"
                    required
                    rows={3}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="ქუჩა, სახლის ნომერი, სართული..."
                    onFocus={handleFormStart}
                    disabled={!city}
                    className={`${inputClass} resize-none py-4 pl-12 pr-4 disabled:cursor-not-allowed disabled:opacity-60`}
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium">{texts.productLabel}</p>
              {productLines.length === 0 ? (
                <p className="text-sm text-muted-foreground">პროდუქტები არ არის ხელმისაწვდომი</p>
              ) : (
                <div className="space-y-3">
                  {productLines.map((product) => (
                    <div
                      key={product.key}
                      className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/65 px-4 py-3"
                    >
                      <Package className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="min-w-0 flex-1 text-sm">
                        {product.label}
                        {product.price > 0 && (
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {product.price} ₾
                          </span>
                        )}
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={999}
                        value={quantities[product.key] || ''}
                        onChange={(e) =>
                          setQuantities({
                            ...quantities,
                            [product.key]: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        placeholder="0"
                        className="h-10 w-16 rounded-lg border border-border bg-card text-center focus:outline-none focus:ring-2 focus:ring-primary/25"
                      />
                      <span className="shrink-0 text-sm text-muted-foreground">{texts.quantityUnit}</span>
                    </div>
                  ))}
                </div>
              )}
              {!hasProducts && productLines.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">{texts.productHint}</p>
              )}
            </div>

            {showSummary && orderTotal != null && shippingFee != null && (
              <div className="space-y-2 rounded-xl border border-primary/15 bg-secondary/70 px-4 py-4 text-sm">
                {productLines
                  .filter((p) => (quantities[p.key] ?? 0) > 0)
                  .map((p) => (
                    <div key={p.key} className="flex justify-between gap-3">
                      <span className="text-muted-foreground">
                        {p.label} × {quantities[p.key]}
                      </span>
                      <span>{(quantities[p.key] ?? 0) * p.price} ₾</span>
                    </div>
                  ))}
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">მიწოდება ({city})</span>
                  <span>{shippingFee === 0 ? 'უფასო' : `${shippingFee} ₾`}</span>
                </div>
                <div className="flex justify-between gap-3 border-t border-border/50 pt-2 font-semibold">
                  <span>ჯამი</span>
                  <span>{orderTotal} ₾</span>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={!hasProducts || !city || !street.trim() || isLoading || productLines.length === 0}
              className="btn-primary w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  იგზავნება...
                </span>
              ) : orderTotal != null ? (
                `${texts.submitButton} — ${orderTotal} ₾`
              ) : (
                texts.submitButton
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground">{texts.termsNote}</p>
          </div>
        </form>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>გთხოვთ გაითვალისწინოთ</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    მოწოდებისას შეფუთვა შესაძლოა დაზიანებული იყოს, ამიტომ გთხოვთ, პროდუქტის
                    მდგომარეობა გადაამოწმოთ კურიერის თანდასწრებით.
                  </p>
                  <p>
                    თბილისში შეცვლა უფასოა. გაითვალისწინეთ, რომ კურიერის წასვლის შემდეგ
                    დაბრუნების სერვისი ფასიანია. თბილისი 6 ლარი, რეგიონი 15 ლარი.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>გაუქმება</AlertDialogCancel>
              <button type="button" className="btn-primary cursor-pointer" onClick={placeOrder}>
                დადასტურება
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  )
}
