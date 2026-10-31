const CATEGORIES = new Set(['sofas', 'beds', 'dining', 'chairs'])
const MAX_BYTES = 8 * 1024 * 1024
const CATALOG_KEY = 'catalog.json'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (!url.pathname.startsWith('/api/')) {
      return new Response('Not found', { status: 404 })
    }

    try {
      if (url.pathname === '/api/session' && request.method === 'GET') {
        return json({ ok: await isAuthed(request, env) })
      }
      if (url.pathname === '/api/login' && request.method === 'POST') {
        return login(request, env, url)
      }
      if (url.pathname === '/api/logout' && request.method === 'POST') {
        return new Response(null, { status: 204, headers: { 'Set-Cookie': cookie('', url, 0) } })
      }
      if (url.pathname === '/api/photos' && request.method === 'GET') {
        const photos = await readCatalog(env.PHOTOS)
        return json(photos.map(toPublic))
      }
      if (url.pathname === '/api/photos' && request.method === 'POST') {
        if (!(await isAuthed(request, env))) return json({ error: 'Sign in again.' }, 401)
        return upload(request, env)
      }
      if (url.pathname === '/api/photos/order' && request.method === 'PUT') {
        if (!(await isAuthed(request, env))) return json({ error: 'Sign in again.' }, 401)
        return reorder(request, env)
      }

      const fileMatch = url.pathname.match(/^\/api\/photos\/([0-9a-f-]{36})\/file$/)
      if (fileMatch && request.method === 'GET') {
        return readFile(env, fileMatch[1])
      }

      const itemMatch = url.pathname.match(/^\/api\/photos\/([0-9a-f-]{36})$/)
      if (itemMatch && request.method === 'PATCH') {
        if (!(await isAuthed(request, env))) return json({ error: 'Sign in again.' }, 401)
        return update(request, env, itemMatch[1])
      }
      if (itemMatch && request.method === 'DELETE') {
        if (!(await isAuthed(request, env))) return json({ error: 'Sign in again.' }, 401)
        return remove(env, itemMatch[1])
      }

      return json({ error: 'Not found' }, 404)
    } catch (error) {
      console.error(error)
      return json({ error: 'Something went wrong saving that photo.' }, 500)
    }
  },
}

async function login(request, env, url) {
  const password = env.ADMIN_PASSWORD || ''
  if (!password) return json({ error: 'The photo desk password is not set yet.' }, 500)

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Enter the password.' }, 400)
  }

  const given = String(body.password || '')
  if (!(await safeEqual(given, password))) {
    return json({ error: 'That password is not right.' }, 401)
  }

  const token = await sign(password)
  return json({ ok: true }, 200, { 'Set-Cookie': cookie(token, url, 60 * 60 * 24 * 14) })
}

async function upload(request, env) {
  let form
  try {
    form = await request.formData()
  } catch {
    return json({ error: 'Choose a photo to upload.' }, 400)
  }

  const category = String(form.get('category') || '')
  if (!CATEGORIES.has(category)) return json({ error: 'Choose a category.' }, 400)

  const file = form.get('file')
  if (!file || typeof file.arrayBuffer !== 'function') return json({ error: 'Choose a photo.' }, 400)
  if (file.size > MAX_BYTES) return json({ error: 'That photo is too large. Use one under 8 MB.' }, 400)
  if (!String(file.type || '').startsWith('image/')) return json({ error: 'That file is not a photo.' }, 400)

  const name = cleanText(form.get('name'), 80) || 'New photo'
  const description = cleanText(form.get('description'), 400)
  const price = formatPrice(form.get('price'))
  const id = crypto.randomUUID()
  const objectKey = `photos/${category}/${id}.jpg`
  const bytes = await file.arrayBuffer()

  await env.PHOTOS.put(objectKey, bytes, {
    httpMetadata: { contentType: 'image/jpeg' },
  })

  try {
    const photos = await readCatalog(env.PHOTOS)
    const position =
      photos
        .filter((item) => item.category === category)
        .reduce((max, item) => Math.max(max, item.position ?? -1), -1) + 1
    const photo = {
      id,
      category,
      name,
      description,
      material: description,
      size: '',
      price,
      position,
      alt: name,
      objectKey,
      contentType: 'image/jpeg',
      createdAt: new Date().toISOString(),
    }
    photos.push(photo)
    await writeCatalog(env.PHOTOS, photos)
    return json(toPublic(photo), 201)
  } catch (error) {
    await env.PHOTOS.delete(objectKey)
    throw error
  }

}

async function update(request, env, id) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Enter an amount.' }, 400)
  }

  const photos = await readCatalog(env.PHOTOS)
  const index = photos.findIndex((item) => item.id === id)
  if (index === -1) return json({ error: 'That photo is already gone.' }, 404)

  const next = { ...photos[index] }
  if ('name' in body) {
    const name = cleanText(body.name, 80)
    if (!name) return json({ error: 'Enter a name.' }, 400)
    next.name = name
    next.alt = name
  }
  if ('description' in body) {
    next.description = cleanText(body.description, 400)
    next.material = next.description
  }
  if ('price' in body) next.price = formatPrice(body.price)
  photos[index] = next
  await writeCatalog(env.PHOTOS, photos)
  return json(toPublic(photos[index]))
}

async function reorder(request, env) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Choose an order.' }, 400)
  }

  const category = String(body.category || '')
  const ids = Array.isArray(body.ids) ? body.ids.map(String) : []
  if (!CATEGORIES.has(category)) return json({ error: 'Choose a category.' }, 400)

  const photos = await readCatalog(env.PHOTOS)
  const current = photos.filter((item) => item.category === category).map((item) => item.id)
  const same =
    ids.length === current.length && current.every((id) => ids.includes(id)) && new Set(ids).size === ids.length
  if (!same) return json({ error: 'The order does not match the photos in this category.' }, 400)

  const rank = new Map(ids.map((id, index) => [id, index]))
  const next = photos.map((photo) =>
    photo.category === category ? { ...photo, position: rank.get(photo.id) } : photo,
  )
  await writeCatalog(env.PHOTOS, next)
  return json(next.filter((photo) => photo.category === category).sort((a, b) => a.position - b.position).map(toPublic))
}

async function remove(env, id) {
  const photos = await readCatalog(env.PHOTOS)
  const photo = photos.find((item) => item.id === id)
  if (!photo) return json({ error: 'That photo is already gone.' }, 404)
  await env.PHOTOS.delete(photo.objectKey)
  await writeCatalog(
    env.PHOTOS,
    photos.filter((item) => item.id !== id),
  )
  return new Response(null, { status: 204 })
}

async function readFile(env, id) {
  const photos = await readCatalog(env.PHOTOS)
  const photo = photos.find((item) => item.id === id)
  if (!photo) return json({ error: 'Photo not found' }, 404)
  const object = await env.PHOTOS.get(photo.objectKey)
  if (!object) return json({ error: 'Photo not found' }, 404)
  return new Response(object.body, {
    headers: {
      'Content-Type': photo.contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

function toPublic(photo) {
  return {
    id: photo.id,
    category: photo.category,
    name: photo.name,
    description: publicDescription(photo),
    material: publicDescription(photo),
    size: photo.size === 'Size to be confirmed' ? '' : photo.size || '',
    price: photo.price,
    position: photo.position ?? 0,
    alt: photo.alt,
    image: `/api/photos/${photo.id}/file`,
    stored: true,
  }
}

async function readCatalog(bucket) {
  const object = await bucket.get(CATALOG_KEY)
  if (!object) return []
  const data = await object.json()
  return Array.isArray(data.photos) ? data.photos : []
}

async function writeCatalog(bucket, photos) {
  await bucket.put(CATALOG_KEY, JSON.stringify({ photos }), {
    httpMetadata: { contentType: 'application/json' },
  })
}

function formatPrice(value) {
  const raw = String(value || '').trim()
  if (!raw || /^on request$/i.test(raw)) return 'On request'
  const digits = raw.replace(/[₹,\s]/g, '')
  if (/^\d+(\.\d+)?$/.test(digits)) {
    const amount = Math.round(Number(digits))
    return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`
  }
  return raw.slice(0, 40)
}

function publicDescription(photo) {
  if (typeof photo.description === 'string') return photo.description
  if (photo.material === 'Added from the photo desk') return ''
  return photo.material || ''
}

function cleanText(value, max) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

async function isAuthed(request, env) {
  const password = env.ADMIN_PASSWORD || ''
  if (!password) return false
  const token = readCookie(request, 'tw_session')
  if (!token) return false
  return token === (await sign(password))
}

async function sign(secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode('trendywoods-photo-desk'))
  return [...new Uint8Array(mac)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function safeEqual(given, expected) {
  const [a, b] = await Promise.all([digest(given), digest(expected)])
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i]
  return diff === 0
}

async function digest(value) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))
}

function readCookie(request, name) {
  const header = request.headers.get('Cookie') || ''
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return rest.join('=')
  }
  return ''
}

function cookie(value, url, maxAge) {
  const secure = url.protocol === 'https:' ? '; Secure' : ''
  return `tw_session=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`
}

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra },
  })
}
