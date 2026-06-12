import orderApi from '@/apiRequests/order'
import http from '@/lib/http'

jest.mock('@/lib/http', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}))

jest.mock('query-string', () => ({
  __esModule: true,
  default: {
    stringify: jest.fn(() => 'mocked=query'),
  },
}))

describe('orderApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createOrder', () => {
    it('should call create order endpoint', async () => {
      const body = {
        tableNumber: 1,
      }

      await orderApi.createOrder(body as any)

      expect(http.post).toHaveBeenCalledWith(
        '/orders',
        body,
      )
    })
  })

  describe('getOrderList', () => {
    it('should build query params correctly', async () => {
      const fromDate = new Date('2025-01-01')
      const toDate = new Date('2025-01-02')

      await orderApi.getOrderList({
        fromDate,
        toDate,
      })

      expect(http.get).toHaveBeenCalledWith(
        expect.stringContaining('/orders?'),
      )
    })

    it('should work without dates', async () => {
      await orderApi.getOrderList({})

      expect(http.get).toHaveBeenCalled()
    })
  })

  describe('updateOrder', () => {
    it('should call update endpoint', async () => {
      const body = {
        status: 'Delivered',
      }

      await orderApi.updateOrder(
        5,
        body as any,
      )

      expect(http.put).toHaveBeenCalledWith(
        '/orders/5',
        body,
      )
    })
  })

  describe('getOrderDetail', () => {
    it('should call detail endpoint', async () => {
      await orderApi.getOrderDetail(10)

      expect(http.get).toHaveBeenCalledWith(
        '/orders/10',
      )
    })
  })

  describe('pay', () => {
    it('should call pay endpoint', async () => {
      const body = {
        orderIds: [1, 2],
      }

      await orderApi.pay(body as any)

      expect(http.post).toHaveBeenCalledWith(
        '/orders/pay',
        body,
      )
    })
  })
})