import { useEffect, useId, useState } from 'react'
import { buildWhatsAppUrl, categoryLabel, enquiryText } from '../data/shop'
import './EnquireModal.css'

const empty = { name: '', phone: '', pieceId: '', note: '' }

function pieceOptionLabel(item, catalog) {
  const name = item.name?.trim()
  if (name && !/^new photo$/i.test(name)) return `${categoryLabel(item.category)} — ${name}`
  const same = catalog.filter((entry) => entry.category === item.category)
  const index = same.findIndex((entry) => entry.id === item.id)
  return `${categoryLabel(item.category)} ${index + 1}`
}

export function EnquireModal({ open, piece, catalog, onClose }) {
  const titleId = useId()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [photoFile, setPhotoFile] = useState(null)

  useEffect(() => {
    if (!open) return undefined
    setForm({ ...empty, pieceId: piece?.id || '' })
    setErrors({})
    setPhotoFile(null)
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, piece, onClose])

  useEffect(() => {
    if (!open || !form.pieceId) return undefined
    const item = catalog.find((entry) => entry.id === form.pieceId)
    if (!item?.image) return undefined
    const controller = new AbortController()
    fetch(item.image, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Photo could not be loaded')
        return response.blob()
      })
      .then((blob) => {
        setPhotoFile({
          id: item.id,
          file: new File([blob], 'trendywoods-piece.jpg', { type: blob.type || 'image/jpeg' }),
        })
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        setPhotoFile(null)
      })
    return () => controller.abort()
  }, [open, form.pieceId, catalog])

  if (!open) return null

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Enter your name'
    if (!form.phone.trim()) next.phone = 'Enter your phone number'
    else if (!/^[\d\s+\-]{8,15}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number'
    if (!form.pieceId) next.pieceId = 'Choose a piece'
    setErrors(next)
    if (Object.keys(next).length) return

    const chosen = catalog.find((item) => item.id === form.pieceId)
    const photoUrl = chosen?.image ? new URL(chosen.image, window.location.origin).href : ''
    const details = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      note: form.note,
    }
    const file = photoFile?.id === chosen?.id ? photoFile.file : null

    if (file && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: enquiryText(details) })
        onClose()
        return
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }

    onClose()
    window.location.assign(buildWhatsAppUrl(enquiryText({ ...details, photoUrl })))
  }

  const chosenPreview = catalog.find((item) => item.id === form.pieceId)

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <p className="eyebrow">WhatsApp</p>
          <h2 id={titleId}>Ask the showroom</h2>
          <p>We will open WhatsApp with this photo and your note. The shop confirms from there.</p>
        </header>
        <form onSubmit={submit}>
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={update('name')} autoComplete="name" />
            {errors.name ? <small className="field-error">{errors.name}</small> : null}
          </label>
          <label className="field">
            <span>Phone</span>
            <input value={form.phone} onChange={update('phone')} inputMode="tel" autoComplete="tel" />
            {errors.phone ? <small className="field-error">{errors.phone}</small> : null}
          </label>
          <label className="field">
            <span>Piece</span>
            {chosenPreview ? (
              <span className="piece-preview">
                <img src={chosenPreview.image} alt="" />
              </span>
            ) : null}
            <select value={form.pieceId} onChange={update('pieceId')}>
              <option value="">Choose a piece</option>
              {catalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {pieceOptionLabel(item, catalog)}
                </option>
              ))}
            </select>
            {errors.pieceId ? <small className="field-error">{errors.pieceId}</small> : null}
          </label>
          <label className="field">
            <span>Note</span>
            <textarea value={form.note} onChange={update('note')} placeholder="Size, fabric, or when you can visit" />
          </label>
          <div className="modal-actions">
            <button className="btn btn-ink" type="submit">
              Continue on WhatsApp
            </button>
            <button className="btn btn-line" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
