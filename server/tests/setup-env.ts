process.env.NODE_ENV = 'test'

process.env.DATABASE_URL = 'test'

process.env.ACCESS_TOKEN_SECRET = 'access-secret'
process.env.ACCESS_TOKEN_EXPIRES_IN = '1h'

process.env.REFRESH_TOKEN_SECRET = 'refresh-secret'
process.env.REFRESH_TOKEN_EXPIRES_IN = '7d'

process.env.GUEST_ACCESS_TOKEN_EXPIRES_IN = '1h'
process.env.GUEST_REFRESH_TOKEN_EXPIRES_IN = '7d'

process.env.INITIAL_EMAIL_OWNER = 'owner@test.com'
process.env.INITIAL_PASSWORD_OWNER = 'password'