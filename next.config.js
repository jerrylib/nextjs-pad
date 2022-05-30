/** @type {import('next').NextConfig} */

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = phase => {
  if (phase === PHASE_DEVELOPMENT_SERVER)
    return {
      env: {
        env_index: 'local',
        MONGO_DB_URL: ''
      }
    }
  return {
    env: {
      env_index: 'pro',
      MONGO_DB_URL: ''
    }
  }
}
