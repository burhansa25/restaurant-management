import authApi from '@/apiRequests/auth'
import http from '@/lib/http'

jest.mock('@/lib/http', () => ({
  post: jest.fn(),
}))

describe('authApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call login endpoint', async () => {
    ;(http.post as jest.Mock).mockResolvedValue({})

    await authApi.login({
      email: 'test@mail.com',
      password: '123456',
    })

    expect(http.post).toHaveBeenCalled()
  })

  it('should call logout endpoint', async () => {
    ;(http.post as jest.Mock).mockResolvedValue({})

    await authApi.logout()

    expect(http.post).toHaveBeenCalled()
  })

  it('should call refresh token endpoint', async () => {
    ;(http.post as jest.Mock).mockResolvedValue({})

    await authApi.refreshToken()

    expect(http.post).toHaveBeenCalled()
  })
})