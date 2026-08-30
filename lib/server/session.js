const TOKEN_KEY = 'laac-auth-token'
const USER_KEY = 'laac-user-id'
const NAME_KEY = 'laac-user-name'
const EMAIL_KEY = 'laac-user-email'

function serializeCookie(name, value, maxAge) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`
}

function buildAuthCookies(token, userId, name, email) {
  const maxAge = 60 * 60 * 24 * 7 // 7 days
  return [
    serializeCookie(TOKEN_KEY, token, maxAge),
    serializeCookie(USER_KEY, userId, maxAge),
    serializeCookie(NAME_KEY, encodeURIComponent(name || ''), maxAge),
    serializeCookie(EMAIL_KEY, encodeURIComponent(email || ''), maxAge),
  ]
}

function clearAuthCookies() {
  const expired = 'Max-Age=0'
  return [
    `${TOKEN_KEY}=; Path=/; HttpOnly; SameSite=Lax; ${expired}`,
    `${USER_KEY}=; Path=/; HttpOnly; SameSite=Lax; ${expired}`,
    `${NAME_KEY}=; Path=/; HttpOnly; SameSite=Lax; ${expired}`,
    `${EMAIL_KEY}=; Path=/; HttpOnly; SameSite=Lax; ${expired}`,
  ]
}

function parseCookies(header) {
  if (!header) return {}
  const out = {}
  header.split(';').forEach((pair) => {
    const [k, ...v] = pair.split('=')
    if (k && v.length) out[k.trim()] = decodeURIComponent(v.join('=').trim())
  })
  return out
}

function getSessionFromRequest(req) {
  const cookieHeader =
    req.headers?.get?.('cookie') || req.headers?.cookie || ''
  const cookies = parseCookies(cookieHeader)
  return {
    token: cookies[TOKEN_KEY] || null,
    userId: cookies[USER_KEY] || null,
    name: cookies[NAME_KEY] ? decodeURIComponent(cookies[NAME_KEY]) : null,
    email: cookies[EMAIL_KEY] ? decodeURIComponent(cookies[EMAIL_KEY]) : null,
  }
}

module.exports = {
  buildAuthCookies,
  clearAuthCookies,
  getSessionFromRequest,
}
