/** @type {import('next').NextConfig} */

const { PHASE_PRODUCTION_BUILD } = require('next/constants')

module.exports = phase => {
  if (phase === PHASE_PRODUCTION_BUILD)
    return {
      env_index: 'pro',
      MONGO_DB_URL: ''
    }
  return {
    env_index: 'local',
    MONGO_DB_URL: ''
  }
}
