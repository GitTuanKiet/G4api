import helmet from 'helmet'

const helmetConfig = {
  frameguard: {
    action: 'deny'
  },
  hsts: {
    maxAge: 5184000,
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: helmet.contentSecurityPolicy.getDefaultDirectives(),
  referrerPolicy: {
    policy: 'same-origin'
  }
}

module.exports = helmet(helmetConfig)
