import { useEffect, useRef, useState } from 'react'
import { categories, categoryLabel } from '../data/shop'
import { shrinkImage } from '../lib/images'
import { deletePhoto, fetchSession, login, logout, reorderPhotos, sortStored, updatePhoto, uploadPhoto } from '../lib/photos'
import { Logo } from './Logo'
import './Admin.css'

const emptyEdit = { name: '', description: '', price: '' }

export function Admin({ stored, onRefresh, onHome }) {
  const fileRef = useRef(null)
  const [authed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [category, setCategory] = useState('sofas')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [files, setFiles] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [edit, setEdit] = useState(emptyEdit)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    fetchSession()
      .then(setAuthed)
      .finally(() => setReady(true))
  }, [])

  useEffect(() => {
    setEditingId(null)
    setPreview(null)
  }, [category])

  useEffect(() => {
    if (!preview) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setPreview(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [preview])

  const saved = sortStored(stored, category)

  const signIn = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await login(password)
      setAuthed(true)
      setPassword('')
    } catch (err) {
      setError(err.message)
    }
  }

  const signOut = async () => {
    await logout()
    setAuthed(false)
  }

  const onPick = (event) => {
    const picked = [...event.target.files].filter((file) => file.type.startsWith('image/'))
    setFiles(picked)
    setError('')
    setNotice('')
  }

  const upload = async (event) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Enter a name.')
      return
    }
    if (!files.length) {
      setError('Choose a photo, then press Upload.')
      return
    }

    setBusy(true)
    setUploading(true)
    setError('')
    let count = 0
    try {
      for (const file of files) {
        setNotice(`Saving ${count + 1} of ${files.length}…`)
        const shrunk = await shrinkImage(file)
        await uploadPhoto({ file: shrunk, category, name, description, price: amount })
        count += 1
      }
      await onRefresh()
      setName('')
      setDescription('')
      setFiles([])
      if (fileRef.current) fileRef.current.value = ''
      setNotice(count === 1 ? '1 photo uploaded.' : `${count} photos uploaded.`)
    } catch (err) {
      setError(err.message)
      if (count) await onRefresh()
    } finally {
      setBusy(false)
      setUploading(false)
    }
  }

  const move = async (index, direction) => {
    const next = index + direction
    if (next < 0 || next >= saved.length) return
    const ids = saved.map((piece) => piece.id)
    ;[ids[index], ids[next]] = [ids[next], ids[index]]
    setBusy(true)
    setError('')
    try {
      await reorderPhotos(category, ids)
      await onRefresh()
      setNotice('Order saved. Photo 1 is the first one visitors see.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const startEdit = (piece) => {
    setEditingId(piece.id)
    setEdit({
      name: piece.name,
      description: piece.description || '',
      price: piece.price === 'On request' ? '' : piece.price,
    })
    setError('')
  }

  const saveEdit = async (event) => {
    event.preventDefault()
    const piece = saved.find((item) => item.id === editingId)
    if (!piece) return
    const trimmedName = edit.name.trim()
    if (!trimmedName) {
      setError('Enter a name.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await updatePhoto(piece.id, {
        name: trimmedName,
        description: edit.description.trim(),
        price: edit.price.trim(),
      })
      await onRefresh()
      setEditingId(null)
      setNotice('Details saved.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id) => {
    setError('')
    try {
      await deletePhoto(id)
      if (preview?.id === id) setPreview(null)
      if (editingId === id) setEditingId(null)
      await onRefresh()
      setNotice('Photo removed.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin">
      <header className="admin-bar">
        <button className="logo-btn" type="button" onClick={onHome}>
          <Logo />
        </button>
        <p>Photo desk</p>
        <button className="btn btn-line" type="button" onClick={onHome}>
          Back to site
        </button>
      </header>

      {!ready ? (
        <main className="admin-login">
          <p>Opening the photo desk…</p>
        </main>
      ) : authed ? (
        <main className="admin-main">
          <div className="admin-intro">
            <h1>Add a photo.</h1>
            <p>
              Fill in the name, description, and amount. Choose a photo, then press Upload. Nothing is saved until you press Upload.
            </p>
          </div>

          <form className="upload-panel" onSubmit={upload}>
            <label className="field">
              <span>Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Forest velvet sofa"
                disabled={busy}
              />
            </label>
            <label className="field">
              <span>Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Velvet upholstery, tapered wood legs"
                disabled={busy}
              />
            </label>
            <div className="upload-row">
              <label className="field">
                <span>Category</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)} disabled={busy}>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Amount</span>
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="On request"
                  inputMode="decimal"
                  disabled={busy}
                />
              </label>
              <label className="field file-field">
                <span>Photo</span>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={onPick} disabled={busy} />
              </label>
              <button className="btn btn-ink" type="submit" disabled={busy}>
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
            </div>
          </form>
          <p className="upload-hint">{files.length ? `Chosen: ${files.map((file) => file.name).join(', ')}` : 'No photo chosen yet. Choosing a photo does not upload it.'}</p>
          {files.length > 1 ? (
            <p className="upload-hint">These photos will share this name and description. You can change each one after they upload.</p>
          ) : null}
          {notice ? <p className="admin-notice">{notice}</p> : null}
          {error ? <p className="field-error">{error}</p> : null}

          <section className="order-list" aria-label={`${categoryLabel(category)} photos`}>
            <h2>{categoryLabel(category)}</h2>
            <p className="order-lead">Photo 1 is the first one visitors see. Move a photo up or down to change that. Click a photo to see it larger.</p>
            {saved.length === 0 ? <p className="order-empty">No photos in this category yet.</p> : null}
            {saved.map((piece, index) => (
              <article key={piece.id} className="order-card">
                <div className="order-rank">
                  <button type="button" onClick={() => move(index, -1)} disabled={busy || index === 0} aria-label="Move up">
                    Up
                  </button>
                  <span>{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={busy || index === saved.length - 1}
                    aria-label="Move down"
                  >
                    Down
                  </button>
                </div>
                <button className="order-photo" type="button" onClick={() => setPreview(piece)}>
                  <img src={piece.image} alt={piece.alt || piece.name} />
                </button>
                {editingId === piece.id ? (
                  <form className="order-edit" onSubmit={saveEdit}>
                    <label>
                      Name
                      <input
                        value={edit.name}
                        onChange={(event) => setEdit((current) => ({ ...current, name: event.target.value }))}
                        disabled={busy}
                      />
                    </label>
                    <label>
                      Description
                      <textarea
                        value={edit.description}
                        onChange={(event) => setEdit((current) => ({ ...current, description: event.target.value }))}
                        disabled={busy}
                      />
                    </label>
                    <label>
                      Amount
                      <input
                        value={edit.price}
                        onChange={(event) => setEdit((current) => ({ ...current, price: event.target.value }))}
                        placeholder="On request"
                        inputMode="decimal"
                        disabled={busy}
                      />
                    </label>
                    <div className="order-edit-actions">
                      <button className="btn btn-ink" type="submit" disabled={busy}>
                        Save
                      </button>
                      <button className="btn btn-line" type="button" onClick={() => setEditingId(null)} disabled={busy}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="order-copy">
                    <strong>{piece.name}</strong>
                    <p>{piece.description || 'No description yet.'}</p>
                    <span>{piece.price}</span>
                    <div className="order-links">
                      <button type="button" onClick={() => setPreview(piece)}>
                        View
                      </button>
                      <button type="button" onClick={() => startEdit(piece)} disabled={busy}>
                        Edit
                      </button>
                      <button type="button" onClick={() => remove(piece.id)} disabled={busy}>
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </section>

          <button className="admin-signout" type="button" onClick={signOut}>
            Sign out
          </button>
        </main>
      ) : (
        <main className="admin-login">
          <form onSubmit={signIn}>
            <p className="eyebrow">Photo desk</p>
            <h1>Sign in</h1>
            <p>Enter the photo desk password to add or remove showroom photos.</p>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              {error ? <small className="field-error">{error}</small> : null}
            </label>
            <button className="btn btn-ink" type="submit">
              Enter
            </button>
          </form>
        </main>
      )}

      {preview ? (
        <div className="preview-backdrop" role="presentation" onClick={() => setPreview(null)}>
          <figure
            className="preview"
            role="dialog"
            aria-modal="true"
            aria-label={preview.name}
            onClick={(event) => event.stopPropagation()}
          >
            <img src={preview.image} alt={preview.alt || preview.name} />
            <figcaption>
              <strong>{preview.name}</strong>
              <button type="button" onClick={() => setPreview(null)}>
                Close
              </button>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  )
}
