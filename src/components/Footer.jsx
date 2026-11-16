import { chatWhatsAppUrl, shop } from '../data/shop'
import { Logo } from './Logo'
import './Footer.css'

export function Footer({ onAdmin }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo light />
          <p>Sofas, cots, cushioning cots, and dining tables.</p>
        </div>
        <div>
          <a href={chatWhatsAppUrl()}>WhatsApp</a>
          <a href={`tel:${shop.phoneTel}`}>{shop.phoneDisplay}</a>
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
    </footer>
  )
}
