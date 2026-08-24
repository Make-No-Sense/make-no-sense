const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD
}

async function hmac(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(message)
  )

  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function equalStrings(a: string, b: string) {
  if (a.length !== b.length) return false

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

export function getAdminSessionMaxAge() {
  return SESSION_MAX_AGE_SECONDS
}

export async function createAdminSessionToken() {
  const secret = getSessionSecret()
  if (!secret) {
    throw new Error('Missing ADMIN_PASSWORD or ADMIN_SESSION_SECRET')
  }

  const createdAt = Date.now().toString()
  const signature = await hmac(createdAt, secret)
  return `${createdAt}.${signature}`
}

export async function isValidAdminSessionToken(token: string | undefined) {
  const secret = getSessionSecret()
  if (!secret || !token) return false

  const [createdAt, signature] = token.split('.')
  if (!createdAt || !signature) return false

  const ageMs = Date.now() - Number(createdAt)
  if (!Number.isFinite(ageMs)) return false
  if (ageMs < 0 || ageMs > SESSION_MAX_AGE_SECONDS * 1000) return false

  const expected = await hmac(createdAt, secret)
  return equalStrings(signature, expected)
}
