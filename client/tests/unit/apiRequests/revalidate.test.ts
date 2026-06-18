import revalidateApi from '@/apiRequests/revalidate'
import http from '@/lib/http'

jest.mock('@/lib/http')

describe('revalidateApi', () => {
  it('should call revalidate endpoint', async () => {
    await revalidateApi('dishes')

    expect(http.get).toHaveBeenCalledWith(
      '/api/revalidate?tag=dishes',
      {
        baseUrl: ''
      }
    )
  })
})