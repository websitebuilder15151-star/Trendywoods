import { categories } from '../data/shop'
import { sortStored } from '../lib/photos'
import './Collections.css'

export function Collections({ stored, covers = {}, onOpen }) {
  return (
    <section id="collections" className="section">
      <div className="container">
        <header className="collections-head">
          <p className="eyebrow">The floor</p>
          <h2 className="section-title">Five kinds of furniture. Nothing else in the way.</h2>
        </header>
        <div className="collection-grid">
          {categories.map((category) => {
            const cover = covers[category.id] || sortStored(stored, category.id)[0]?.image
            return (
              <button
                key={category.id}
                className="collection-card"
                type="button"
                onClick={() => onOpen(category.id)}
              >
                {cover ? <img src={cover} alt="" /> : null}
                <span>
                  <strong>{category.label}</strong>
                  <em>{category.blurb}</em>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
