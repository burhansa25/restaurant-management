import Fastify from 'fastify'
import fastifyAuth from '@fastify/auth'
import validatorCompilerPlugin from '@/plugins/validatorCompiler.plugins'

const mockLoginController = jest.fn()
const mockRefreshTokenController = jest.fn()
const mockLogoutController = jest.fn()
const mockRequireLoginedHook = jest.fn()
const mockLoginGoogleController = jest.fn()

jest.mock('@/controllers/auth.controller', () => ({
  __esModule: true,
  loginController: mockLoginController,
  loginGoogleController: mockLoginGoogleController,
  refreshTokenController: mockRefreshTokenController,
  logoutController: mockLogoutController
}))

jest.mock('@/hooks/auth.hooks', () => ({
  __esModule: true,
  requireLoginedHook: mockRequireLoginedHook
}))

describe('Auth Routes', () => {
  let app: ReturnType<typeof Fastify>

  beforeAll(async () => {
    app = Fastify({ logger: false })
    await app.register(validatorCompilerPlugin)
    await app.register(fastifyAuth, { defaultRelation: 'and' })

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const authRoutes = require('../../src/routes/auth.route').default

    await app.register(authRoutes, { prefix: '/auth' })
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockRequireLoginedHook.mockImplementation(async (request: any) => {
      request.decodedAccessToken = { userId: 1, role: 'Owner' }
    })
  })

  it('logs in successfully with valid credentials', async () => {
    mockLoginController.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      account: { id: 1, email: 'owner@test.com', name: 'Owner', role: 'Owner' }
    })

    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'owner@test.com', password: 'password' }
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual(
      expect.objectContaining({
        message: 'Đăng nhập thành công',
        data: expect.objectContaining({
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
          account: expect.objectContaining({ email: 'owner@test.com' })
        })
      })
    )
    expect(mockLoginController).toHaveBeenCalledWith({ email: 'owner@test.com', password: 'password' })
  })

  it('returns 200 when refresh token is valid', async () => {
    mockRefreshTokenController.mockResolvedValue({ accessToken: 'new-access', refreshToken: 'new-refresh' })

    const response = await app.inject({
      method: 'POST',
      url: '/auth/refresh-token',
      payload: { refreshToken: 'refresh-token' }
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual(
      expect.objectContaining({
        message: 'Lấy token mới thành công',
        data: expect.objectContaining({
          accessToken: 'new-access',
          refreshToken: 'new-refresh'
        })
      })
    )
    expect(mockRefreshTokenController).toHaveBeenCalledWith('refresh-token')
  })

  it('logs out with authenticated request', async () => {
    mockLogoutController.mockResolvedValue('Đăng xuất thành công')

    const response = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      payload: { refreshToken: 'refresh-token' },
      headers: {
        authorization: 'Bearer token'
      }
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({ message: 'Đăng xuất thành công' })
    expect(mockLogoutController).toHaveBeenCalledWith('refresh-token')
    expect(mockRequireLoginedHook).toHaveBeenCalled()
  })

  it('returns schema error when login body is invalid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'invalid-email', password: '123' }
    })

    expect(response.statusCode).toBe(400)
  })
  it('redirects successfully when google login succeeds', async () => {
    mockLoginGoogleController.mockResolvedValue({
      accessToken: 'google-access',
      refreshToken: 'google-refresh'
    })

    const response = await app.inject({
      method: 'GET',
      url: '/auth/login/google?code=test-code'
    })

    expect(response.statusCode).toBe(302)

    expect(response.headers.location).toContain('google-access')

    expect(response.headers.location).toContain('google-refresh')
  })
})
