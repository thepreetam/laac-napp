const config = require('../config')

let _instance = null

function getStore() {
  if (_instance) return _instance

  const backend = config.STORE_BACKEND || 'machaao'

  switch (backend) {
    case 'machaao': {
      const MachaaoStore = require('./machaao-store')
      _instance = new MachaaoStore()
      break
    }
    default:
      throw new Error(`Unknown store backend: ${backend}`)
  }

  return _instance
}

module.exports = { getStore }
