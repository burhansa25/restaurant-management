import { POST } from '@/app/api/auth/refresh-token/route'
import authApi from '@/apiRequests/auth'
import jwt from 'jsonwebtoken'

jest.mock('@/apiRequests/auth')
jest.mock('jsonwebtoken')

const mockSet = jest.fn()

jest.mock('next/headers', () => ({
  cookies: async () => ({
    get: () => ({
      value: 'refresh-token',
    }),
    set: mockSet,
  }),
}))

describe('refresh token route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should refresh token', async () => {
    ;(
      authApi.sRefreshToken as jest.Mock
    ).mockResolvedValue({
      payload: {
        data: {
          accessToken: 'new-access',
          refreshToken: 'new-refresh',
        },
      },
    })

    ;(jwt.decode as jest.Mock)
      .mockReturnValueOnce({ exp: 1000 })
      .mockReturnValueOnce({ exp: 2000 })

    const res = await POST({} as Request)

    expect(mockSet).toHaveBeenCalledTimes(2)
    expect(res.status).toBe(200)
  })
})