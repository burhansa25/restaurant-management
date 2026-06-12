import { POST } from '@/app/api/auth/login/route'
import authApi from '@/apiRequests/auth'
import jwt from 'jsonwebtoken'

jest.mock('@/apiRequests/auth')
jest.mock('jsonwebtoken')

const mockSet = jest.fn()

const mockCookieStore = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
}

jest.mock('next/headers', () => ({
  cookies: async () => ({
    set: mockSet,
  }),
}))

describe('login route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should login successfully', async () => {
    ;(authApi.sLogin as jest.Mock).mockResolvedValue({
      payload: {
        data: {
          accessToken: 'access',
          refreshToken: 'refresh',
        },
      },
    })

    ;(jwt.decode as jest.Mock)
      .mockReturnValueOnce({ exp: 1000 })
      .mockReturnValueOnce({ exp: 2000 })

    const req = {
      json: async () => ({
        email: 'test@mail.com',
        password: '123',
      }),
    } as Request

    const res = await POST(req)

    expect(mockSet).toHaveBeenCalledTimes(2)
    expect(res.status).toBe(200)
  })
})