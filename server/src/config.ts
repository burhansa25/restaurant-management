import fs from 'fs'
import path from 'path'
import z from 'zod'
import { config } from 'dotenv'

const envPath = path.resolve('.env')
if (fs.existsSync(envPath)) {
  config({
    path: envPath
  })
}

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DOCKER_HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  GUEST_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  GUEST_REFRESH_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  INITIAL_EMAIL_OWNER: z.string(),
  INITIAL_PASSWORD_OWNER: z.string(),
  DOMAIN: z.string().default('localhost'),
  PROTOCOL: z.enum(['http', 'https']).default('http'),
  UPLOAD_FOLDER: z.string().default('uploads'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  CLIENT_DOCKER_URL: z.string().default('http://client:3000'),
  GOOGLE_REDIRECT_CLIENT_URL: z.string().optional().default(''),
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
  GOOGLE_AUTHORIZED_REDIRECT_URI: z.string().optional().default(''),
  PRODUCTION: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true'),
  PRODUCTION_URL: z.string().default('http://localhost:4000'),
  SERVER_TIMEZONE: z.string().default('Asia/Jakarta')
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
  console.error(configServer.error.issues)
  throw new Error('Invalid environment configuration')
}

const envConfig = configServer.data
export const API_URL = envConfig.PRODUCTION
  ? envConfig.PRODUCTION_URL
  : `${envConfig.PROTOCOL}://${envConfig.DOMAIN}:${envConfig.PORT}`
export const CLIENT_ORIGINS = Array.from(new Set([envConfig.CLIENT_URL, envConfig.CLIENT_DOCKER_URL].filter(Boolean)))
export default envConfig

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof configSchema> {}
  }
}
