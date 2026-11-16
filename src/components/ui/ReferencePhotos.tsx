'use client'

import { ChangeEvent, useState } from 'react'

export type ReferencePhoto = { name: string; type: string; base64: string; size: number }

export default function ReferencePhotos({ photos, onChange }: { photos: ReferencePhoto[]; onChange: (photos: ReferencePhoto[]) => void }) {
  const [error, setError] = useState('')
  const [reading, setReading] = useState(false)
  const add = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    setError('')
    if (!files.length) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
    if (photos.length + files.length > 5 || files.some(f => !allowed.includes(f.type) || f.size > 5 * 1024 * 1024 || !f.size) || photos.reduce((sum, f) => sum + f.size, 0) + files.reduce((sum, f) => sum + f.size, 0) > 10 * 1024 * 1024) {
      setError('Choose up to 5 JPG, PNG, WebP or HEIC images, 5 MB each and 10 MB total.')
      return
    }
    setReading(true)
    try {
      const added = await Promise.all(files.map(file => new Promise<ReferencePhoto>((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.onload = () => resolve({ name: file.name, type: file.type, size: file.size, base64: String(reader.result).split(',')[1] })
        reader.readAsDataURL(file)
      })))
      onChange([...photos, ...added])
    } catch { setError('Unable to read the selected photos. Please try again.') }
    finally { setReading(false) }
  }
  return (
    <fieldset className="space-y-3 border border-border rounded p-4" disabled={reading}>
      <legend className="text-sm font-medium text-charcoal">Upload Reference Photos (optional)</legend>
      <p className="text-sm text-muted">Add up to 5 images of your design, inspiration or project. Maximum 5 MB each, 10 MB total.</p>
      <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" onChange={add} className="w-full text-sm" />
      {reading && <p className="text-sm">Preparing photos...</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo, i) => <div key={i} className="min-w-0 border border-border rounded p-2">
          {['image/heic','image/heif'].includes(photo.type) ? <p className="text-sm">HEIC image</p> : <img src={`data:${photo.type};base64,${photo.base64}`} alt={photo.name} className="w-full h-24 object-contain" />}
          <p className="text-xs truncate">{photo.name}</p>
          <button type="button" onClick={() => onChange(photos.filter((_, index) => index !== i))} className="text-sm underline">Remove</button>
        </div>)}
      </div>
    </fieldset>
  )
}
