import guestApi from '@/apiRequests/guest'
import http from '@/lib/http'

jest.mock('@/lib/http', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn()
  }
}))

describe('guestApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    guestApi.refreshTokenRequest = null
  })

  it('sLogin should call server login endpoint', async () => {
    await guestApi.sLogin({} as any)

    expect(http.post).toHaveBeenCalledWith(
      '/guest/auth/login',
      expect.anything()
    )
  })

  it('login should call client login endpoint', async () => {
    await guestApi.login({} as any)

    expect(http.post).toHaveBeenCalledWith(
      '/api/guest/auth/login',
      expect.anything(),
      {
        baseUrl: ''
      }
    )
  })

  it('sLogout should call server logout endpoint', async () => {
    await guestApi.sLogout({
      refreshToken: 'rt',
      accessToken: 'at'
    })

    expect(http.post).toHaveBeenCalledWith(
      '/guest/auth/logout',
      {
        refreshToken: 'rt'
      },
      {
        headers: {
          Authorization: 'Bearer at'
        }
      }
    )
  })

  it('logout should call route handler', async () => {
    await guestApi.logout()

    expect(http.post).toHaveBeenCalledWith(
      '/api/guest/auth/logout',
      null,
      {
        baseUrl: ''
      }
    )
  })

  it('sRefreshToken should call server refresh endpoint', async () => {
    await guestApi.sRefreshToken({
      refreshToken: 'abc'
    })

    expect(http.post).toHaveBeenCalledWith(
      '/guest/auth/refresh-token',
      {
        refreshToken: 'abc'
      }
    )
  })

  it('order should call guest order endpoint', async () => {
    await guestApi.order({} as any)

    expect(http.post).toHaveBeenCalledWith(
      '/guest/orders',
      expect.anything()
    )
  })

  it('getOrderList should call guest order list endpoint', async () => {
    await guestApi.getOrderList()

    expect(http.get).toHaveBeenCalledWith(
      '/guest/orders'
    )
  })

  it('refreshToken should create refresh request', async () => {
    ;(http.post as jest.Mock).mockResolvedValue({
      status: 200,
      payload: {}
    })

    await guestApi.refreshToken()

    expect(http.post).toHaveBeenCalledWith(
      '/api/guest/auth/refresh-token',
      null,
      {
        baseUrl: ''
      }
    )
  })

  it('refreshToken should reset refreshTokenRequest after success', async () => {
    ;(http.post as jest.Mock).mockResolvedValue({
      status: 200,
      payload: {}
    })

    await guestApi.refreshToken()

    expect(
      guestApi.refreshTokenRequest
    ).toBeNull()
  })

  it('refreshToken should call http.post once', async () => {
    ;(http.post as jest.Mock).mockResolvedValue({
        status: 200,
        payload: {},
    })

    await Promise.all([
        guestApi.refreshToken(),
        guestApi.refreshToken(),
    ])

    expect(http.post).toHaveBeenCalledTimes(1)
    })
})