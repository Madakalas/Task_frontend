'use client'

import { useState, useRef } from 'react'
import { Navbar } from '@/components/navbar'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, DollarSign, Cloud, X, AlertCircle, CheckCircle } from 'lucide-react'

const API_BASE = 'http://localhost:8000'

type Step = 1 | 2 | 'success'

interface FormData { title: string; price: string; location: string }
type FormErrors = Partial<Record<keyof FormData, string>>

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.title.trim()) errors.title = 'Property title is required'
  if (!data.price || Number(data.price) <= 0) errors.price = 'Price must be greater than 0'
  if (!data.location.trim()) errors.location = 'Location is required'
  return errors
}

export default function AddPropertyPage() {
  const [step, setStep] = useState<Step>(1)
  const [propertyId, setPropertyId] = useState('')
  const [form, setForm] = useState<FormData>({ title: '', price: '', location: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  const [files, setFiles] = useState<File[]>([])
  const [fileErrors, setFileErrors] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  // Step 1 submit
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validate(form)
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }
    setFormErrors({})
    setSubmitting(true)
    setApiError('')
    try {
      const res = await fetch(`${API_BASE}/api/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, price: Number(form.price), location: form.location }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create property')
      setPropertyId(data.data._id)
      setStep(2)
    } catch (err: any) {
      setApiError(err.message || 'Failed to create property. Is the backend running?')
    } finally {
      setSubmitting(false)
    }
  }

  // File handling
  const handleFiles = (incoming: File[]) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    const errs: string[] = []
    const valid = incoming.filter(f => {
      if (!allowed.includes(f.type)) { errs.push(`${f.name}: unsupported format`); return false }
      if (f.size > 10 * 1024 * 1024) { errs.push(`${f.name}: exceeds 10MB`); return false }
      return true
    })
    const merged = [...files, ...valid]
    if (merged.length > 5) { errs.push('Maximum 5 images allowed'); setFileErrors(errs); return }
    setFileErrors(errs)
    setFiles(merged)
  }

  // Step 2 submit
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) { setFileErrors(['Please select at least one image']); return }
    setUploading(true)
    setProgress(0)
    setApiError('')
    // Simulate progress
    const interval = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 300)
    try {
      const fd = new FormData()
      files.forEach(f => fd.append('images', f))
      const res = await fetch(`${API_BASE}/api/properties/${propertyId}/images`, { method: 'POST', body: fd })
      clearInterval(interval)
      setProgress(100)
      if (res.status !== 202) throw new Error('Upload failed')
      setTimeout(() => setStep('success'), 400)
    } catch (err: any) {
      clearInterval(interval)
      setApiError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Back */}
        <Link href="/" className="flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-3">New Listing</p>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">List a Property</h1>
          <p className="text-foreground/50">Share your exceptional property with the world</p>
        </div>

        {/* Step indicator */}
        {step !== 'success' && (
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2].map(n => (
              <div key={n} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                  step === n ? 'bg-primary text-primary-foreground border-primary' :
                  (typeof step === 'number' && step > n) ? 'bg-primary/20 text-primary border-primary/50' :
                  'bg-secondary/30 text-foreground/40 border-border'
                }`}>{n}</div>
                <span className={`text-sm ${step === n ? 'text-foreground font-medium' : 'text-foreground/40'}`}>
                  {n === 1 ? 'Property Details' : 'Upload Images'}
                </span>
                {n === 1 && <div className="w-12 h-px bg-border mx-1" />}
              </div>
            ))}
          </div>
        )}

        {/* Card */}
        <div className="bg-card rounded-2xl p-8 border border-border">
          {/* API Error */}
          {apiError && (
            <div className="mb-6 flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-xl p-4">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{apiError}</p>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-5">
              <div>
                <label className="block text-xs text-foreground/50 uppercase tracking-wider font-medium mb-2">Property Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Beachfront Villa in Goa"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-foreground/30 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                />
                {formErrors.title && <p className="text-destructive text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{formErrors.title}</p>}
              </div>

              <div>
                <label className="block text-xs text-foreground/50 uppercase tracking-wider font-medium mb-2">Asking Price (USD) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. 2500000"
                    min="1"
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-foreground/30 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
                {formErrors.price && <p className="text-destructive text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{formErrors.price}</p>}
              </div>

              <div>
                <label className="block text-xs text-foreground/50 uppercase tracking-wider font-medium mb-2">Location *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Goa, India"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-foreground/30 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                />
                {formErrors.location && <p className="text-destructive text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{formErrors.location}</p>}
              </div>

              <button type="submit" disabled={submitting} className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/80 transition-colors disabled:opacity-60 mt-2">
                {submitting ? 'Creating...' : 'Continue →'}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-6">
              <button type="button" onClick={() => setStep(1)} className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Step 1
              </button>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(Array.from(e.dataTransfer.files)) }}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${dragging ? 'border-primary bg-primary/10' : 'border-primary/30 hover:border-primary/60 hover:bg-primary/5'}`}
                onClick={() => fileRef.current?.click()}
              >
                <Cloud className="h-12 w-12 mx-auto mb-4 text-primary/60" />
                <p className="text-foreground font-semibold mb-1">Drag & drop images here</p>
                <p className="text-foreground/40 text-sm mb-4">JPEG, PNG, WebP — max 10MB each</p>
                <span className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg">Browse Files</span>
                <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e => handleFiles(Array.from(e.target.files || []))} className="hidden" />
              </div>

              {/* File errors */}
              {fileErrors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 space-y-1">
                  {fileErrors.map((e, i) => <p key={i} className="text-destructive text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" />{e}</p>)}
                </div>
              )}

              {/* Preview grid */}
              {files.length > 0 && (
                <div>
                  <p className="text-xs text-foreground/50 uppercase tracking-wider font-medium mb-3">{files.length} of 5 images selected</p>
                  <div className="grid grid-cols-3 gap-3">
                    {files.map((f, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-border aspect-square bg-secondary/30">
                        <Image src={URL.createObjectURL(f)} alt={f.name} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-2 right-2 bg-black/60 hover:bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/50 px-2 py-1">
                          <p className="text-white text-xs truncate">{f.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress bar */}
              {uploading && (
                <div className="space-y-2">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-sm text-foreground/50 text-center">Uploading... {Math.round(progress)}%</p>
                </div>
              )}

              <button type="submit" disabled={uploading || files.length === 0} className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/80 transition-colors disabled:opacity-60">
                {uploading ? 'Uploading...' : 'Upload & Analyze →'}
              </button>
            </form>
          )}

          {/* SUCCESS */}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Property Listed!</h2>
              <p className="text-foreground/50 text-sm mb-8 max-w-xs mx-auto">
                Your images are being analyzed by AI. This usually takes 30–60 seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={`/properties/${propertyId}`} className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/80 transition-colors">
                  View Property
                </Link>
                <button
                  onClick={() => { setStep(1); setForm({ title: '', price: '', location: '' }); setFiles([]); setPropertyId('') }}
                  className="px-6 py-3 border border-border text-foreground font-semibold rounded-xl hover:bg-secondary/30 transition-colors"
                >
                  Add Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
