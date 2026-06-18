import http, {
  HttpError,
  EntityError
} from '@/lib/http'

global.fetch = jest.fn()

jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

jest.mock('@/config', () => ({
  NEXT_PUBLIC_API_ENDPOINT: 'http://localhost:3000'
}))

jest.mock('@/lib/utils', () => ({
  normalizePath: jest.fn((url) => url),
  getAccessTokenFromLocalStorage: jest.fn(),
  setAccessTokenToLocalStorage: jest.fn(),
  setRefreshTokenToLocalStorage: jest.fn(),
  removeAccessTokenFromLocalStorage: jest.fn(),
  removeRefreshTokenFromLocalStorage: jest.fn()
}))

describe('http.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET success', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true
      })
    })

    const result = await http.get('/test')

    expect(result.status).toBe(200)
  })

  it('POST success', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true
      })
    })

    const result = await http.post('/test', {
      name: 'Burhan'
    })

    expect(result.status).toBe(200)
  })

  it('PUT success', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true
      })
    })

    const result = await http.put('/test', {})

    expect(result.status).toBe(200)
  })

  it('DELETE success', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true
      })
    })

    const result = await http.delete('/test')

    expect(result.status).toBe(200)
  })

  it('throws EntityError on 422', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({
        message: 'Validation error',
        errors: []
      })
    })

    await expect(
      http.post('/test', {})
    ).rejects.toBeInstanceOf(EntityError)
  })

  it('throws HttpError on 500', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({
        message: 'Server error'
      })
    })

    await expect(
      http.get('/test')
    ).rejects.toBeInstanceOf(HttpError)
  })
})