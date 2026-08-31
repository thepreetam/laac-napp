/**
 * StoreInterface — abstract base defining the data-access contract.
 * Every implementation must satisfy every method listed here.
 */
class StoreInterface {
  // ── O(1) Key / Value ─────────────────────────────────────────
  async get(key) { throw new Error('Not implemented') }
  async set(key, value, ttl) { throw new Error('Not implemented') }
  async update(key, fields) { throw new Error('Not implemented') }
  async del(key) { throw new Error('Not implemented') }

  // ── Searchable Content ───────────────────────────────────────
  async createContent(type, title, body, tags, metadata) { throw new Error('Not implemented') }
  async searchContent(type, query, tags, page, limit, options) { throw new Error('Not implemented') }
  async getContent(slug) { throw new Error('Not implemented') }
  async updateContent(slug, fields) { throw new Error('Not implemented') }
  async deleteContent(slug) { throw new Error('Not implemented') }

  // ── Users ────────────────────────────────────────────────────
  async registerUser(email, password, firstName, lastName) { throw new Error('Not implemented') }
  async loginUser(email, password) { throw new Error('Not implemented') }
  async getUser(userId) { throw new Error('Not implemented') }
  async updateUser(userId, fields) { throw new Error('Not implemented') }
  async getUserPreferences(userId) { throw new Error('Not implemented') }
  async setUserPreferences(userId, prefs) { throw new Error('Not implemented') }

  // ── Password Management ──────────────────────────────────────
  async resetUserPassword(email, newPassword) { throw new Error('Not implemented') }

  // ── Migration ────────────────────────────────────────────────
  async exportUserData(userId) { throw new Error('Not implemented') }
  async importUserData(userId, data) { throw new Error('Not implemented') }
  async listAllUsers() { throw new Error('Not implemented') }
}

module.exports = StoreInterface
