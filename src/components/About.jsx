import './About.css'

const notes = [
  { title: 'Sit before you decide', copy: 'The showroom is the catalogue. Try the sofa, the bed, the chair.' },
  { title: 'Wood and cloth', copy: 'Frames in solid wood. Seats in leather, linen, and velvet.' },
  { title: 'Ask on WhatsApp', copy: 'Send a room photo. We reply with size, fabric, and delivery.' },
]

export function About() {
  return (
    <section id="about" className="about">
      <div className="about-photo">
        <img src="/gallery/showroom.jpg" alt="Mustard lounge chair in a light wood showroom" />
      </div>
      <div className="about-copy">
        <p className="eyebrow">The showroom</p>
        <h2 className="section-title">A floor you can walk, not a catalogue you only scroll.</h2>
        <p className="section-lead">
          Trendywoods keeps the range simple: sofas, beds, dining tables, and chairs.
          Come in, or message the showroom and we will tell you what will actually fit.
        </p>
        <ul>
          {notes.map((note) => (
            <li key={note.title}>
              <strong>{note.title}</strong>
              <span>{note.copy}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
