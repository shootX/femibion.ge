'use client'

import { useState } from 'react'
import { User, Phone, MapPin, Package, CheckCircle, Loader2, Truck } from 'lucide-react'
import { submitOrder } from '@/app/actions/orders'

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
  product1Option: string
  product2Option: string
  quantityUnit: string
  productHint: string
  submitButton: string
  termsNote: string
  successTitle: string
  successMessage: string
  newOrderButton: string
}

export function OrderForm({ texts }: { texts: OrderTexts }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    product1Qty: 0,
    product2Qty: 0,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.product1Qty <= 0 && formData.product2Qty <= 0) return
    setIsLoading(true)
    setError(null)
    const result = await submitOrder({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      product1Qty: formData.product1Qty,
      product2Qty: formData.product2Qty,
      product1Label: texts.product1Option,
      product2Label: texts.product2Option,
    })
    setIsLoading(false)
    if (result.success) {
      setIsSubmitted(true)
    } else {
      setError(result.error || 'შეცდომა')
    }
  }

  const hasProducts = formData.product1Qty > 0 || formData.product2Qty > 0

  if (isSubmitted) {
    return (
      <section id="order" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-lg mx-auto text-center">
            <div className="rounded-3xl bg-card border border-border p-8 md:p-12 shadow-xl">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {texts.successTitle}
              </h2>
              <p className="text-muted-foreground mb-6">
                {texts.successMessage}
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
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
    <section id="order" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4 text-balance">
            {texts.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {texts.subtitle}
          </p>
          {texts.shippingInfo && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary/5 border border-primary/20 px-4 py-3 text-sm text-foreground">
              <Truck className="h-5 w-5 shrink-0 text-primary" />
              <span>{texts.shippingInfo}</span>
            </div>
          )}
        </div>

        <div className="max-w-lg mx-auto">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-card border border-border p-6 md:p-10 shadow-xl"
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {texts.nameLabel}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder={texts.namePlaceholder}
                    className="w-full h-14 rounded-2xl border border-input bg-input pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {texts.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <div className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    +995
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder={texts.phonePlaceholder}
                    className="w-full h-14 rounded-2xl border border-input bg-input pl-24 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {texts.addressLabel}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                  <textarea
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder={texts.addressPlaceholder}
                    rows={3}
                    className="w-full rounded-2xl border border-input bg-input pl-12 pr-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  {texts.productLabel}
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-input bg-input px-4 py-3">
                    <Package className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 text-sm text-foreground">
                      {texts.product1Option}
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={999}
                      value={formData.product1Qty || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          product1Qty: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      placeholder="0"
                      className="h-10 w-20 rounded-xl border border-input bg-background px-3 text-center text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground shrink-0">
                      {texts.quantityUnit}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-input bg-input px-4 py-3">
                    <Package className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 text-sm text-foreground">
                      {texts.product2Option}
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={999}
                      value={formData.product2Qty || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          product2Qty: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      placeholder="0"
                      className="h-10 w-20 rounded-xl border border-input bg-background px-3 text-center text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground shrink-0">
                      {texts.quantityUnit}
                    </span>
                  </div>
                </div>
                {!hasProducts && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {texts.productHint}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <button
                type="submit"
                disabled={!hasProducts || isLoading}
                className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    იგზავნება...
                  </>
                ) : (
                  texts.submitButton
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                {texts.termsNote}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
