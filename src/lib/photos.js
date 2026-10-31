async function readError(response, fallback) {
  const data = await response.json().catch(() => ({}))
  return new Error(data.error || fallback)
}

export async function fetchPhotos() {
  const response = await fetch('/api/photos')
  if (!response.ok) throw new Error('Could not load saved photos')
  return response.json()
}

export async function fetchSession() {
  const response = await fetch('/api/session')
  if (!response.ok) return false
  const data = await response.json()
  return Boolean(data.ok)
}

export async function login(password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!response.ok) throw await readError(response, 'Could not sign in')
}

export async function logout() {
  await fetch('/api/logout', { method: 'POST' })
}

export function sortStored(photos, category) {
  return photos
    .filter((photo) => photo.category === category)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
}

export async function uploadPhoto({ file, category, name, description, price }) {
  const body = new FormData()
  body.set('file', file)
  body.set('category', category)
  body.set('name', name || '')
  body.set('description', description || '')
  if (price) body.set('price', price)
  const response = await fetch('/api/photos', { method: 'POST', body })
  if (!response.ok) throw await readError(response, 'Could not save that photo')
  return response.json()
}

export async function updatePhoto(id, details) {
  const response = await fetch(`/api/photos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  })
  if (!response.ok) throw await readError(response, 'Could not save those details')
  return response.json()
}

export async function reorderPhotos(category, ids) {
  const response = await fetch('/api/photos/order', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, ids }),
  })
  if (!response.ok) throw await readError(response, 'Could not save that order')
  return response.json()
}

export async function deletePhoto(id) {
  const response = await fetch(`/api/photos/${id}`, { method: 'DELETE' })
  if (!response.ok) throw await readError(response, 'Could not remove that photo')
}
