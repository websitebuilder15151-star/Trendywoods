import { useEffect, useId, useState } from 'react'
import { buildWhatsAppUrl, categoryLabel } from '../data/shop'
import './EnquireModal.css'

const empty = { name: '', phone: '', pieceId: '', note: '' }

export function EnquireModal({ open, piece, catalog, onClose }) {
  const titleId = useId()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return undefined
    setForm({ ...empty, pieceId: piece?.id || '' })
    setErrors({})
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

  if (!open) return null

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const submit = (event) => {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Enter your name'
    if (!form.phone.trim()) next.phone = 'Enter your phone number'
    else if (!/^[\d\s+\-]{8,15}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number'
    if (!form.pieceId) next.pieceId = 'Choose a piece'
    setErrors(next)
    if (Object.keys(next).length) return

    const chosen = catalog.find((item) => item.id === form.pieceId)
    const label = chosen ? `${chosen.name} (${categoryLabel(chosen.category)})` : 'A piece from the showroom'
    const url = buildWhatsAppUrl({
      name: form.name.trim(),
      phone: form.phone.trim(),
      piece: label,
      note: form.note,
    })
    onClose()
    window.location.assign(url)
  }

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
          <p>We will open WhatsApp with your note filled in. The shop confirms from there.</p>
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
            <select value={form.pieceId} onChange={update('pieceId')}>
              <option value="">Choose a piece</option>
              {catalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {categoryLabel(item.category)} — {item.name}
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
