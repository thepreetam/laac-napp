const settings = {
  API_BASE_URL: process.env.MACHAAO_API_BASE_URL || 'https://api.machaao.com',
  API_VERSION: process.env.MACHAAO_API_VERSION || 'v2',
  API_TOKEN: process.env.MACHAAO_API_TOKEN || '',
  DEVELOPER_TOKEN: process.env.MACHAAO_DEVELOPER_TOKEN || '',
  APP_ID: process.env.MACHAAO_APP_ID || '',
  STORE_BACKEND: process.env.STORE_BACKEND || 'machaao',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DEBUG: process.env.DEBUG === 'true',
  SESSION_SECRET: process.env.SESSION_SECRET || 'laac-pipeline-dev-secret',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  get apiUrl() {
    return `${this.API_BASE_URL}/${this.API_VERSION}`
  },
}

module.exports = settings
