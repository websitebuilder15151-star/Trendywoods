import { useState } from 'react'
import { Logo } from './Logo'
import './Navbar.css'

const links = [
  { id: 'collections', label: 'Collections' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'Showroom' },
  { id: 'visit', label: 'Visit' },
]

export function Navbar({ onEnquire, onNavigate }) {
  const [open, setOpen] = useState(false)

  const go = (id) => {
    setOpen(false)
    if (window.location.pathname !== '/') onNavigate('/')
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 30)
  }

  return (
    <header className="nav">
      <a className="skip" href="#collections">
        Skip to collections
      </a>
      <div className="nav-bar">
        <button className="logo-btn" type="button" onClick={() => onNavigate('/')}>
          <Logo />
        </button>
        <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Primary">
          {links.map((link) => (
            <button key={link.id} type="button" onClick={() => go(link.id)}>
              {link.label}
            </button>
          ))}
          <button
            className="btn btn-ink nav-enquire"
            type="button"
            onClick={() => {
              setOpen(false)
              onEnquire()
            }}
          >
            Enquire
          </button>
        </nav>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
