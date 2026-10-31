/** Dummy showroom data. Swap these values when the real shop details arrive. */

export const shop = {
  name: 'Trendywoods',
  phoneDisplay: '+91 79938 01036',
  phoneTel: '+917993801036',
  whatsappNumber: '917993801036',
  email: 'hello@trendywoods.example',
  address: {
    line1: 'Trendywoods Showroom',
    line2: '42 Residency Road',
    city: 'Bengaluru, Karnataka 560025',
  },
  mapsUrl: 'https://maps.google.com/?q=Residency+Road+Bengaluru',
  hours: [
    { days: 'Monday – Saturday', time: '10:00 AM – 8:00 PM' },
    { days: 'Sunday', time: '11:00 AM – 6:00 PM' },
  ],
}

export const categories = [
  {
    id: 'sofas',
    label: 'Sofas',
    blurb: 'Three-seaters, compact lounges, and the seat everyone picks first.',
  },
  {
    id: 'beds',
    label: 'Beds',
    blurb: 'Platform frames and upholstered beds for a quieter room.',
  },
  {
    id: 'dining',
    label: 'Dining tables',
    blurb: 'Tables for four, six, and the long lunch that runs late.',
  },
  {
    id: 'chairs',
    label: 'Chairs',
    blurb: 'Dining chairs and lounge chairs you can pull up anywhere.',
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
    id: 'tufted-wing-bed',
    category: 'beds',
    name: 'Tufted Wing Bed',
    material: 'Upholstered headboard, hardwood frame',
    size: 'Queen · 160 × 200 cm',
    price: '₹72,000',
    image: '/gallery/bed-01.jpg',
    alt: 'Cream button-tufted bed with a matching bench',
  },
  {
    id: 'channel-bed',
    category: 'beds',
    name: 'Channel Bed',
    material: 'Ribbed upholstery, slim metal legs',
    size: 'King · 180 × 200 cm',
    price: '₹68,000',
    image: '/gallery/bed-02.jpg',
    alt: 'Light grey channel-tufted bed in a dark bedroom',
  },
  {
    id: 'oak-platform-bed',
    category: 'beds',
    name: 'Oak Platform Bed',
    material: 'Solid oak platform, low profile',
    size: 'Queen · 160 × 200 cm',
    price: '₹54,000',
    image: '/gallery/bed-03.jpg',
    alt: 'Low oak platform bed dressed in white linen',
  },
  {
    id: 'sage-guest-bed',
    category: 'beds',
    name: 'Sage Guest Bed',
    material: 'Upholstered frame, timber base',
    size: 'Queen · 160 × 200 cm',
    price: '₹46,000',
    image: '/gallery/bed-04.jpg',
    alt: 'Bed with sage bedding in a plant-filled bedroom',
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
  {
    id: 'shell-lounge-chair',
    category: 'chairs',
    name: 'Shell Lounge Chair',
    material: 'Moulded seat, bentwood legs',
    size: '72 × 70 × 76 cm',
    price: '₹14,500',
    image: '/gallery/chair-01.jpg',
    alt: 'White shell lounge chair with a wood base',
  },
  {
    id: 'ivory-button-chair',
    category: 'chairs',
    name: 'Ivory Button Chair',
    material: 'Tufted upholstery, turned legs',
    size: '68 × 64 × 78 cm',
    price: '₹16,800',
    image: '/gallery/chair-02.jpg',
    alt: 'Ivory button-tufted chair on a white background',
  },
  {
    id: 'black-shell-stool',
    category: 'chairs',
    name: 'Black Shell Stool',
    material: 'Moulded seat, oak dowel legs',
    size: '46 × 48 × 106 cm',
    price: '₹9,200',
    image: '/gallery/chair-03.jpg',
    alt: 'Black bar stool with wooden legs',
  },
  {
    id: 'black-oak-chair',
    category: 'chairs',
    name: 'Black Oak Chair',
    material: 'Moulded seat, oak legs',
    size: '50 × 54 × 82 cm',
    price: '₹7,400',
    image: '/gallery/chair-04.jpg',
    alt: 'Black dining chair with oak legs',
  },
]

export function categoryLabel(id) {
  return categories.find((category) => category.id === id)?.label || 'Piece'
}

export function buildWhatsAppUrl({ name, phone, piece, note }) {
  const lines = [
    `Hello ${shop.name}, I would like to ask about a piece.`,
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Piece: ${piece}`,
  ]

  if (note?.trim()) lines.push(`Note: ${note.trim()}`)

  lines.push('', 'Please share availability and the next step.')

  return `https://wa.me/${shop.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`
}

export function chatWhatsAppUrl() {
  const text = encodeURIComponent(`Hello ${shop.name}, I would like to visit the showroom.`)
  return `https://wa.me/${shop.whatsappNumber}?text=${text}`
}
