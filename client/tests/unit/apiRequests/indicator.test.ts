import indicatorApi from '@/apiRequests/indicator'
import http from '@/lib/http'

jest.mock('query-string', () => ({
  __esModule: true,
  default: {
    stringify: jest.fn(() => 'mocked=query'),
  },
}))

jest.mock('@/lib/http')

describe('indicatorApi', () => {
  it('should build dashboard query', async () => {
    await indicatorApi.getDashBoardIndicators({
      fromDate: new Date('2025-01-01'),
      toDate: new Date('2025-01-02')
    } as any)

    expect(http.get).toHaveBeenCalled()
  })
})