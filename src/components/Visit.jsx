import { chatWhatsAppUrl, shop } from '../data/shop'
import './Visit.css'

export function Visit({ onEnquire }) {
  return (
    <section id="visit" className="visit">
      <div className="container visit-grid">
        <div>
          <p className="eyebrow light">Visit or message</p>
          <h2 className="section-title">The showroom is open. WhatsApp is faster.</h2>
          <p className="visit-lead">
            Walk in to sit on the pieces, or send a note and we will open the chat with your question ready.
          </p>
          <div className="visit-actions">
            <a className="btn btn-cream" href={chatWhatsAppUrl()}>
              Chat on WhatsApp
            </a>
            <button className="btn btn-line-light" type="button" onClick={onEnquire}>
              Enquire about a piece
            </button>
          </div>
        </div>
        <div className="visit-card">
          <div>
            <h3>Address</h3>
            <p>
              {shop.address.line1}
              <br />
              {shop.address.line2}
              <br />
              {shop.address.city}
            </p>
            <a href={shop.mapsUrl}>Open in maps</a>
          </div>
          <div>
            <h3>Contact</h3>
            <p>
              <a href={`tel:${shop.phoneTel}`}>{shop.phoneDisplay}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
