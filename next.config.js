const UnoCSS = require('@unocss/webpack').default

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: config => {
    config.cache = false
    config.plugins.push(UnoCSS())
    return config
  }
}

module.exports = nextConfig

// TODO: legacy config for mogodb
// module.exports = phase => {
//   if (phase === PHASE_DEVELOPMENT_SERVER)
//     return {
//       env: {
//         env_index: 'local',
//         MONGO_DB_URL: 'mongodb+srv://boccc:hPqOfVfct6yMnYx8@cluster0.clfqb.mongodb.net/local-db?retryWrites=true&w=majority'
//       }
//     }
//   return {
//     env: {
//       env_index: 'pro',
//       MONGO_DB_URL: 'mongodb+srv://boccc:hPqOfVfct6yMnYx8@cluster0.clfqb.mongodb.net/pro-db?retryWrites=true&w=majority'
//     }
//   }
// }
