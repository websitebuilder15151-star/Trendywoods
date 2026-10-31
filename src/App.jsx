import { useCallback, useEffect, useState } from 'react'
import { About } from './components/About'
import { Admin } from './components/Admin'
import { Collections } from './components/Collections'
import { EnquireModal } from './components/EnquireModal'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { Visit } from './components/Visit'
import { WhatsAppFab } from './components/WhatsAppFab'
import { fetchPhotos } from './lib/photos'

function isAdminPath(path) {
  return path === '/admin' || path === '/admin/'
}

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  const [stored, setStored] = useState([])
  const [enquireOpen, setEnquireOpen] = useState(false)
  const [enquirePiece, setEnquirePiece] = useState(null)
  const [category, setCategory] = useState('sofas')

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (isAdminPath(path)) return
    const id = window.location.hash.replace('#', '')
    if (!id) return
    const node = document.getElementById(id)
    if (node) node.scrollIntoView()
  }, [path])

  const navigate = useCallback((to) => {
    window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo(0, 0)
  }, [])

  const openCategory = useCallback((id) => {
    setCategory(id)
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/')
      setPath('/')
    }
    window.setTimeout(() => {
      document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }, [])

  const openEnquire = useCallback((piece) => {
    setEnquirePiece(piece || null)
    setEnquireOpen(true)
  }, [])

  const refreshPhotos = useCallback(async () => {
    try {
      setStored(await fetchPhotos())
    } catch {
      setStored([])
    }
  }, [])

  useEffect(() => {
    refreshPhotos()
  }, [refreshPhotos])

  if (isAdminPath(path)) {
    return (
      <Admin
        stored={stored}
        onRefresh={refreshPhotos}
        onHome={() => navigate('/')}
      />
    )
  }

  return (
    <>
      <Navbar onEnquire={() => openEnquire()} onNavigate={navigate} />
      <main>
        <Hero onEnquire={() => openEnquire()} onBrowse={() => openCategory('sofas')} />
        <Collections stored={stored} onOpen={openCategory} />
        <About />
        <Gallery
          category={category}
          stored={stored}
          onCategory={setCategory}
          onEnquire={openEnquire}
        />
        <Visit onEnquire={() => openEnquire()} />
      </main>
      <Footer onAdmin={() => navigate('/admin')} />
      <WhatsAppFab />
      <EnquireModal
        open={enquireOpen}
        piece={enquirePiece}
        catalog={stored}
        onClose={() => setEnquireOpen(false)}
      />
    </>
  )
}
