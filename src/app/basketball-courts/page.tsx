'use client'

import { useState, FormEvent } from 'react'
import { order, config } from '@/content'
import { assetPath } from '@/utils/basePath'

interface FormData {
  name: string
  email: string
  phone: string
  contactPreference: string
  projectType: string
  dimensions: string
  style: string
  colorPreference: string
  budget: string
  description: string
}

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  contactPreference: '',
  projectType: 'Custom Basketball Court',
  dimensions: '',
  style: '',
  colorPreference: '',
  budget: '',
  description: '',
}

export default function BasketballCourtPage() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const [courtTeam, setCourtTeam] = useState('')
  const [courtSize, setCourtSize] = useState('')
  const [courtUse, setCourtUse] = useState('Wall art')
  const courtPrices: Record<string, string> = { '2 ft': '$700', '3 ft': '$1,200', '4 ft': '$1,750', '5 ft': '$2,500' }

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!config.appsScriptUrl) {
      alert('Order form is not yet connected. Please contact Austin directly at ' + config.ownerEmail)
      return
    }

    setStatus('submitting')
    try {
      const submission = {
        ...form,
        ...{ dimensions: courtSize, budget: `Starting at ${courtPrices[courtSize]}`, style: courtUse, colorPreference: '', description: `Preferred contact: ${form.contactPreference}\nTeam / court: ${courtTeam}\nIntended use: ${courtUse}\n${form.description}` },
        timestamp: new Date().toISOString(),
        action: 'submitOrder',
      }

      const response = await fetch(config.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(submission),
      })

      const data = await response.json()
      if (data.success) {
        setStatus('success')
        setForm(initialForm)
        setCourtTeam('')
        setCourtSize('')
        setCourtUse('Wall art')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="text-5xl mb-6">&#10003;</div>
          <h1 className="font-display text-3xl text-walnut mb-4">Court Request Received!</h1>
          <p className="text-muted text-lg mb-8">{order.successMessage}</p>
          <button
            onClick={() => setStatus('idle')}
            className="text-walnut hover:text-oak font-medium border-b-2 border-walnut/30 hover:border-walnut transition-colors pb-1"
          >
            Submit Another Court Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-walnut mb-4">Request a Custom Basketball Court</h1>
          <p className="text-muted text-lg">Choose your court design and size below, and I’ll get back to you with a custom quote.</p>
          <img src={assetPath('/photos/kentucky-court.jpg')} alt="Handcrafted Kentucky basketball court replica" className="w-full h-auto rounded-xl mt-8" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Phone Number {form.contactPreference === 'Text' && <span className="text-red-500">*</span>}</label>
            <input type="tel" required={form.contactPreference === 'Text'} minLength={form.contactPreference === 'Text' ? 14 : undefined} value={form.phone} onChange={(e) => update('phone', formatPhone(e.target.value))} placeholder="(555) 123-4567" className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30" />
          </div>

          <fieldset className="space-y-2">
            <legend className="block text-sm font-medium text-charcoal mb-1">How would you prefer to be contacted? <span className="text-red-500">*</span></legend>
            <div className="flex flex-wrap gap-6">
              {['Text', 'Email'].map((method) => (
                <label key={method} className="flex items-center gap-2 text-charcoal">
                  <input type="radio" name="contactPreference" required value={method} checked={form.contactPreference === method} onChange={() => update('contactPreference', method)} />
                  {method === 'Text' ? 'Text message' : 'Email'}
                </label>
              ))}
            </div>
          </fieldset>


            <section className="space-y-5 border border-border rounded p-5">
              <div>
                <label htmlFor="court-team" className="block text-sm font-medium text-charcoal mb-1">Team / Court Design *</label>
                <input id="court-team" required value={courtTeam} onChange={(e) => setCourtTeam(e.target.value)} placeholder="e.g., Kentucky – Rupp Arena" className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30" />
              </div>
              <div>
                <label htmlFor="court-size" className="block text-sm font-medium text-charcoal mb-1">Court Size *</label>
                <select id="court-size" required value={courtSize} onChange={(e) => setCourtSize(e.target.value)} className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30">
                  <option value="">Select a size...</option>
                  {Object.entries(courtPrices).map(([size, price]) => <option key={size} value={size}>{size} wide — Starting at {price}</option>)}
                </select>
                {courtSize && <p className="mt-2 font-medium text-walnut">Starting price: {courtPrices[courtSize]}</p>}
                <p className="mt-2 text-sm text-muted">Prices are starting prices and may vary based on design complexity and customization. Desks and tabletops may cost extra.</p>
              </div>
              <div>
                <label htmlFor="court-use" className="block text-sm font-medium text-charcoal mb-1">Intended Use</label>
                <select id="court-use" value={courtUse} onChange={(e) => setCourtUse(e.target.value)} className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30">
                  {['Wall art', 'Desk', 'Tabletop'].map((use) => <option key={use}>{use}</option>)}
                </select>
              </div>
            </section>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Additional Customization
            </label>
            <textarea rows={5} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Tell me about your idea — what it's for, any specific details, reference images you have in mind..." className="w-full px-4 py-3 border border-border rounded bg-warm-white focus:outline-none focus:ring-2 focus:ring-walnut/30 resize-y" />
          </div>

          <p className="text-sm text-muted italic">Current turnaround time will be confirmed with your quote.</p>

          <button type="submit" disabled={status === 'submitting'} className="w-full bg-walnut hover:bg-oak text-cream py-4 rounded text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {status === 'submitting' ? 'Submitting...' : 'Submit Basketball Court Request'}
          </button>

          {status === 'error' && (
            <p className="text-red-600 text-center">
              Something went wrong. Please try again or email{' '}
              <a href={`mailto:${config.ownerEmail}`} className="underline">{config.ownerEmail}</a>.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
