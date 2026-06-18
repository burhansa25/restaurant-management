import { mediaApiRequest } from '@/apiRequests/media'
import http from '@/lib/http'

jest.mock('@/lib/http')

describe('mediaApiRequest', () => {
  it('upload', async () => {
    const formData = new FormData()

    await mediaApiRequest.upload(formData)

    expect(http.post).toHaveBeenCalledWith(
      '/media/upload',
      formData
    )
  })
})