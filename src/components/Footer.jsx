import { chatWhatsAppUrl, shop } from '../data/shop'
import { Logo } from './Logo'
import './Footer.css'

export function Footer({ onAdmin }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo light />
          <p>Sofas, beds, dining tables, and chairs.</p>
        </div>
        <div>
          <a href={chatWhatsAppUrl()}>WhatsApp</a>
          <a href={`tel:${shop.phoneTel}`}>{shop.phoneDisplay}</a>
          <a href={`mailto:${shop.email}`}>{shop.email}</a>
        </div>
        <div>
          <p>
            {shop.address.line2}
            <br />
            {shop.address.city}
          </p>
          <button type="button" onClick={onAdmin}>
            Photo desk
          </button>
        </div>
      </div>
      <p className="footer-note">
        Demo showroom. Photos, prices, address, and phone number are placeholders.
      </p>
    </footer>
  )
}
