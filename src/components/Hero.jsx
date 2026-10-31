import { chatWhatsAppUrl } from '../data/shop'
import './Hero.css'

export function Hero({ onEnquire, onBrowse }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Furniture showroom</p>
        <h1>Sofas, beds, and tables with a quieter kind of style.</h1>
        <p className="hero-lead">
          Solid wood and upholstered pieces you can sit with in the showroom.
          Ask about a size, a fabric, or a delivery date on WhatsApp.
        </p>
        <div className="hero-actions">
          <button className="btn btn-ink" type="button" onClick={onBrowse}>
            Browse the floor
          </button>
          <button className="btn btn-line" type="button" onClick={onEnquire}>
            Enquire about a piece
          </button>
          <a className="hero-chat" href={chatWhatsAppUrl()}>
            Chat on WhatsApp
          </a>
        </div>
      </div>
      <div className="hero-photo">
        <img
          src="/gallery/hero.jpg"
          alt="A living room with a grey sofa, wood table, and tall windows"
        />
      </div>
    </section>
  )
}
