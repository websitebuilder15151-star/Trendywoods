export const shop = {
  name: 'Trendywoods',
  phoneDisplay: '+91 83093 05161',
  phoneTel: '+918309305161',
  whatsappNumber: '918309305161',
  address: {
    line1: 'Trendy Woods Furnitures',
    line2: '7GRP+G7P, Badangpet - Nadargul Main Rd, near New Muncipal office, Libera Enclave',
    city: 'Badangpet, Hyderabad, Telangana 500112',
  },
  mapsUrl: 'https://maps.app.goo.gl/iuEz9oHt8W9WYpUy5',
}

export const categories = [
  {
    id: 'sofas',
    label: 'Sofas',
    blurb: 'Three-seaters, compact lounges, and the seat everyone picks first.',
  },
  {
    id: 'cots',
    label: 'Cots',
    blurb: 'Cots for a smaller room.',
  },
  {
    id: 'cushion-cots',
    label: 'Cushioning cots',
    blurb: 'Cushioned cots with a softer top.',
  },
  {
    id: 'dining',
    label: 'Dining tables',
    blurb: 'Tables for four, six, and the long lunch that runs late.',
  },
  {
    id: 'general',
    label: 'General',
    blurb: 'Other pieces from the showroom.',
  },
]

export const pieces = [
  {
    id: 'forest-velvet-sofa',
    category: 'sofas',
    name: 'Forest Velvet Sofa',
    material: 'Velvet upholstery, tapered wood legs',
    size: '210 × 86 × 80 cm',
    price: '₹62,000',
    image: '/gallery/sofa-01.jpg',
    alt: 'Deep green velvet sofa with wooden legs',
  },
  {
    id: 'grey-tufted-sofa',
    category: 'sofas',
    name: 'Grey Tufted Sofa',
    material: 'Textured weave, hardwood frame',
    size: '206 × 90 × 84 cm',
    price: '₹48,500',
    image: '/gallery/sofa-02.jpg',
    alt: 'Grey button-tufted sofa in a bright living room',
  },
  {
    id: 'tan-leather-sofa',
    category: 'sofas',
    name: 'Tan Leather Three-Seater',
    material: 'Full-grain leather, oak legs',
    size: '228 × 94 × 82 cm',
    price: '₹86,000',
    image: '/gallery/sofa-03.jpg',
    alt: 'Tan leather three-seater sofa',
  },
  {
    id: 'clay-two-seater',
    category: 'sofas',
    name: 'Clay Two-Seater',
    material: 'Woven fabric, oak legs',
    size: '168 × 88 × 80 cm',
    price: '₹41,000',
    image: '/gallery/sofa-04.jpg',
    alt: 'Rust orange two-seater sofa with a pink cushion',
  },
  {
    id: 'marble-table-eight',
    category: 'dining',
    name: 'Marble Table for Eight',
    material: 'Stone top, brass-finished legs',
    size: '220 × 100 × 76 cm',
    price: '₹78,000',
    image: '/gallery/dining-01.jpg',
    alt: 'White dining table set for eight with green velvet chairs',
  },
  {
    id: 'walnut-table-six',
    category: 'dining',
    name: 'Walnut Table for Six',
    material: 'Walnut top, solid wood trestle',
    size: '180 × 90 × 76 cm',
    price: '₹52,000',
    image: '/gallery/dining-02.jpg',
    alt: 'Walnut dining table with six grey chairs',
  },
  {
    id: 'oak-table-four',
    category: 'dining',
    name: 'Oak Table for Four',
    material: 'Solid oak top and legs',
    size: '120 × 80 × 75 cm',
    price: '₹34,000',
    image: '/gallery/dining-03.jpg',
    alt: 'Light oak dining table with four wooden chairs',
  },
  {
    id: 'long-oak-table',
    category: 'dining',
    name: 'Long Oak Table',
    material: 'Reclaimed oak, seats a crowd',
    size: '300 × 100 × 76 cm',
    price: '₹64,000',
    image: '/gallery/dining-04.jpg',
    alt: 'Long wooden dining table set with plates and glasses',
  },
]

export function categoryLabel(id) {
  return categories.find((category) => category.id === id)?.label || 'Piece'
}

export function enquiryText({ name, phone, note, photoUrl }) {
  const lines = [`Hello ${shop.name}, I would like to ask about this piece.`, '']

  if (photoUrl) lines.push(photoUrl, '')

  lines.push(`Name: ${name}`, `Phone: ${phone}`)
  if (note?.trim()) lines.push(`Note: ${note.trim()}`)
  lines.push('', 'Please share availability and the next step.')

  return lines.join('\n')
}

export function buildWhatsAppUrl(text) {
  return `https://wa.me/${shop.whatsappNumber}?text=${encodeURIComponent(text)}`
}

export function chatWhatsAppUrl() {
  const text = encodeURIComponent(`Hello ${shop.name}, I would like to visit the showroom.`)
  return `https://wa.me/${shop.whatsappNumber}?text=${text}`
}
