import { useEffect, useState } from 'react'
import { categories, categoryLabel } from '../data/shop'
import { sortStored } from '../lib/photos'
import './Gallery.css'

export function Gallery({ category, stored, onCategory, onEnquire }) {
  const [active, setActive] = useState(null)
  const visible = sortStored(stored, category)

  useEffect(() => {
    if (!active) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setActive(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [active])

  const open = (piece) => setActive(piece)

  return (
    <section id="gallery" className="section gallery">
      <div className="container">
        <header className="gallery-head">
          <p className="eyebrow">Photos</p>
          <h2 className="section-title">Look by piece.</h2>
          <p className="section-lead">
            Open a photo for the description, the amount, and a WhatsApp enquiry.
          </p>
        </header>

        <div className="tabs" role="tablist" aria-label="Furniture categories">
          {categories.map((item) => {
            const count = stored.filter((piece) => piece.category === item.id).length
            const selected = item.id === category
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={selected ? 'tab selected' : 'tab'}
                onClick={() => {
                  onCategory(item.id)
                  setActive(null)
                }}
              >
                {item.label}
                <span>{count}</span>
              </button>
            )
          })}
        </div>

        {visible.length === 0 ? (
          <p className="gallery-empty">No photos in this category yet.</p>
        ) : (
          <div className="piece-grid" role="tabpanel">
            {visible.map((piece) => (
              <button key={piece.id} className="piece" type="button" onClick={() => open(piece)}>
                <span className="piece-photo">
                  <img src={piece.image} alt={piece.alt} loading="lazy" />
                </span>
                <span className="piece-meta">
                  <strong>{piece.name}</strong>
                  <span>{piece.price}</span>
                </span>
                {piece.description ? <span className="piece-material">{piece.description}</span> : null}
              </button>
            ))}
          </div>
        )}
      </div>

      {active ? (
        <div className="detail-backdrop" role="presentation" onClick={() => setActive(null)}>
          <article
            className="detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="piece-title"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={active.image} alt={active.alt} />
            <div className="detail-copy">
              <p className="eyebrow">{categoryLabel(active.category)}</p>
              <h3 id="piece-title">{active.name}</h3>
              {active.description ? <p>{active.description}</p> : null}
              <dl>
                {active.size ? (
                  <div>
                    <dt>Size</dt>
                    <dd>{active.size}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Amount</dt>
                  <dd>{active.price}</dd>
                </div>
              </dl>
              <div className="detail-actions">
                <button
                  className="btn btn-ink"
                  type="button"
                  onClick={() => {
                    setActive(null)
                    onEnquire(active)
                  }}
                >
                  Ask on WhatsApp
                </button>
                <button className="btn btn-line" type="button" onClick={() => setActive(null)}>
                  Close
                </button>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  )
}
