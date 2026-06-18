import { POST } from '@/app/api/auth/logout/route'
import authApi from '@/apiRequests/auth'

jest.mock('@/apiRequests/auth')

const mockDelete = jest.fn()

jest.mock('next/headers', () => ({
  cookies: async () => ({
    get: (key: string) => ({
      value:
        key === 'accessToken'
          ? 'access'
          : 'refresh',
    }),
    delete: mockDelete,
  }),
}))

describe('logout route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should logout successfully', async () => {
    ;(
      authApi.sLogout as jest.Mock
    ).mockResolvedValue({
      payload: {
        success: true,
      },
    })

    const res = await POST({} as Request)

    expect(authApi.sLogout).toHaveBeenCalled()

    expect(res.status).toBe(200)
  })
})