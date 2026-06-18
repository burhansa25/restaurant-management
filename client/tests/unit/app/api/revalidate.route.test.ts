import { GET } from '@/app/api/revalidate/route'
import { revalidateTag } from 'next/cache'

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}))

describe('revalidate route', () => {
  it('should call revalidateTag', async () => {
    const request: any = {
      nextUrl: {
        searchParams: {
          get: () => 'orders',
        },
      },
    }

    const res = await GET(request)

    expect(revalidateTag).toHaveBeenCalledWith(
      'orders',
    )

    expect(res.status).toBe(200)
  })
})