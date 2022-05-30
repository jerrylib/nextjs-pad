/** @type {import('next').NextConfig} */

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = phase => {
  if (phase === PHASE_DEVELOPMENT_SERVER)
    return {
      env: {
        env_index: 'local',
        MONGO_DB_URL: 'mongodb+srv://boccc:hPqOfVfct6yMnYx8@cluster0.clfqb.mongodb.net/local-db?retryWrites=true&w=majority'
      }
    }
  return {
    env: {
      env_index: 'pro',
      MONGO_DB_URL: 'mongodb+srv://boccc:hPqOfVfct6yMnYx8@cluster0.clfqb.mongodb.net/pro-db?retryWrites=true&w=majority'
    }
  }
}
