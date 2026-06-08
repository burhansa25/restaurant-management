import envConfig, {
  API_URL,
  CLIENT_ORIGINS
} from '@/config'

describe('Config', () => {
  it('should load env config', () => {
    expect(envConfig).toBeDefined()
  })

  it('should have port', () => {
    expect(envConfig.PORT).toBeDefined()
  })

  it('should have upload folder', () => {
    expect(envConfig.UPLOAD_FOLDER).toBeDefined()
  })

  it('should generate api url', () => {
    expect(API_URL).toBeDefined()
  })

  it('should generate client origins', () => {
    expect(Array.isArray(CLIENT_ORIGINS)).toBe(true)
  })
})