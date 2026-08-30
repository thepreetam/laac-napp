const axios = require('axios')
const StoreInterface = require('./base')
const config = require('../config')

class MachaaoStore extends StoreInterface {
  constructor() {
    super()
    this.appId = config.APP_ID
    this.apiClient = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.API_TOKEN}`,
      },
    })
    this.devClient = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.DEVELOPER_TOKEN}`,
      },
    })
  }

  // ── O(1) Key / Value ─────────────────────────────────────────

  async get(key) {
    const slug = this._slugify(key)
    try {
      const { data } = await this.devClient.get(
        `/developers/apps/${this.appId}/app-data/${slug}`
      )
      return data?.data?.value ?? null
    } catch (err) {
      if (err.response?.status === 404) return null
      throw err
    }
  }

  async set(key, value, ttl) {
    const slug = this._slugify(key)
    const body = { value }
    if (ttl) body.ttl = ttl
    const { data } = await this.devClient.put(
      `/developers/apps/${this.appId}/app-data/${slug}`,
      body
    )
    return data?.data?.value ?? value
  }

  async update(key, fields) {
    const slug = this._slugify(key)
    const { data } = await this.devClient.put(
      `/developers/apps/${this.appId}/app-data/${slug}`,
      { update: fields }
    )
    return data?.data?.value ?? null
  }

  async del(key) {
    const slug = this._slugify(key)
    await this.devClient.delete(
      `/developers/apps/${this.appId}/app-data/${slug}`
    )
    return true
  }

  // ── Searchable Content ───────────────────────────────────────

  async createContent(type, title, body, tags = [], metadata = {}) {
    const slug = this._slugify(`${type}-${title}`)
    const payload = {
      title,
      content: body,
      slug,
      type,
      tags,
      status: 1,
      metadata,
    }
    const { data } = await this.apiClient.post('/content', payload)
    return data?.data ?? null
  }

  async searchContent(type, q = '', tags = [], page = 1, limit = 20) {
    const params = { type, page: String(page), limit: String(limit) }
    if (q) params.q = q
    if (tags.length > 0) params.tags = tags.join(',')
    const { data } = await this.apiClient.get('/content', { params })
    return data?.data ?? []
  }

  async getContent(slug) {
    try {
      const { data } = await this.apiClient.get(`/content/slug/${slug}`)
      return data?.data ?? null
    } catch (err) {
      if (err.response?.status === 404) return null
      throw err
    }
  }

  async updateContent(slug, fields = {}) {
    const body = { ...fields }
    if (body.status === undefined) body.status = 1
    const { data } = await this.apiClient.put(`/content/slug/${slug}`, body)
    return data?.data ?? null
  }

  async deleteContent(slug) {
    await this.apiClient.delete(`/content/slug/${slug}`)
    return true
  }

  // ── Users ────────────────────────────────────────────────────

  async registerUser(email, password, firstName, lastName) {
    const { data } = await this.devClient.post(
      `/developers/apps/${this.appId}/register`,
      { email, password, firstName, lastName }
    )
    return data?.data ?? null
  }

  async loginUser(email, password) {
    const { data } = await this.devClient.post(
      `/developers/apps/${this.appId}/login`,
      { email, password }
    )
    return data?.data ?? null
  }

  async getUser(userId) {
    return await this.get(`user-${this._slugify(userId)}-profile`)
  }

  async updateUser(userId, fields) {
    return await this.update(`user-${this._slugify(userId)}-profile`, fields)
  }

  async getUserPreferences(userId) {
    return await this.get(`user-${this._slugify(userId)}-preferences`)
  }

  async setUserPreferences(userId, prefs) {
    return await this.set(`user-${this._slugify(userId)}-preferences`, prefs)
  }

  // ── Migration ────────────────────────────────────────────────

  async exportUserData(userId) {
    const profile = await this.getUser(userId)
    const preferences = await this.getUserPreferences(userId)
    return { profile, preferences }
  }

  async importUserData(userId, data) {
    if (data.profile) {
      await this.set(`user-${this._slugify(userId)}-profile`, data.profile)
    }
    if (data.preferences) {
      await this.set(`user-${this._slugify(userId)}-preferences`, data.preferences)
    }
    return true
  }

  async listAllUsers() {
    const result = await this.get('pipeline-user-registry')
    return Array.isArray(result) ? result : []
  }

  // ── Helpers ──────────────────────────────────────────────────

  _slugify(str) {
    return String(str)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
}

module.exports = MachaaoStore
