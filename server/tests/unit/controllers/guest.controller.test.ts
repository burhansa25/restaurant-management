import { DishStatus, OrderStatus, TableStatus } from '@/constants/type'

const mockOrderCreate = jest.fn()
const mockDishSnapshotCreate = jest.fn()
const mockDishFindUniqueOrThrow = jest.fn()
const mockGuestFindUniqueOrThrow = jest.fn()
const mockTableFindUniqueOrThrow = jest.fn()
const mockTransaction = jest.fn()

jest.mock('@/database', () => ({
  __esModule: true,
  default: {
    $transaction: mockTransaction
  }
}))

import { guestCreateOrdersController } from '@/controllers/guest.controller'

const mockTx = {
  guest: {
    findUniqueOrThrow: mockGuestFindUniqueOrThrow
  },
  table: {
    findUniqueOrThrow: mockTableFindUniqueOrThrow
  },
  dish: {
    findUniqueOrThrow: mockDishFindUniqueOrThrow
  },
  dishSnapshot: {
    create: mockDishSnapshotCreate
  },
  order: {
    create: mockOrderCreate
  }
}

describe('guestCreateOrdersController', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockTransaction.mockImplementation((callback) => callback(mockTx))
    mockGuestFindUniqueOrThrow.mockResolvedValue({
      id: 1,
      tableNumber: 1
    })
    mockTableFindUniqueOrThrow.mockResolvedValue({
      number: 1,
      status: TableStatus.Available
    })
    mockDishFindUniqueOrThrow.mockResolvedValue({
      id: 1,
      name: 'Nasi Goreng',
      price: 10000,
      description: 'desc',
      image: '/dish.jpg',
      status: DishStatus.Available
    })
    mockDishSnapshotCreate.mockResolvedValue({
      id: 10,
      name: 'Nasi Goreng',
      price: 10000,
      description: 'desc',
      image: '/dish.jpg',
      status: DishStatus.Available,
      dishId: 1
    })
    mockOrderCreate.mockImplementation(({ data }) => ({
      id: 20,
      ...data,
      dishSnapshot: {
        id: data.dishSnapshotId,
        status: DishStatus.Available
      },
      guest: {
        id: data.guestId
      },
      orderHandler: null
    }))
  })

  it('saves trimmed note when guest creates order', async () => {
    await guestCreateOrdersController(1, [
      {
        dishId: 1,
        quantity: 2,
        note: '  Tidak pedas  '
      }
    ])

    expect(mockOrderCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          note: 'Tidak pedas'
        })
      })
    )
  })

  it('saves null note when guest creates order without note', async () => {
    await guestCreateOrdersController(1, [
      {
        dishId: 1,
        quantity: 2
      }
    ])

    expect(mockOrderCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          note: null
        })
      })
    )
  })

  it('saves null note when guest creates order with empty note', async () => {
    await guestCreateOrdersController(1, [
      {
        dishId: 1,
        quantity: 2,
        note: '   '
      }
    ])

    expect(mockOrderCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          note: null
        })
      })
    )
  })

  it('keeps pending status when guest creates order with note', async () => {
    await guestCreateOrdersController(1, [
      {
        dishId: 1,
        quantity: 2,
        note: 'Tidak pedas'
      }
    ])

    expect(mockOrderCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: OrderStatus.Pending
        })
      })
    )
  })

  it('rejects order when guest table is deleted', async () => {
    mockGuestFindUniqueOrThrow.mockResolvedValueOnce({
      id: 1,
      tableNumber: null
    })

    await expect(
      guestCreateOrdersController(1, [
        {
          dishId: 1,
          quantity: 2
        }
      ])
    ).rejects.toThrow()

    expect(mockOrderCreate).not.toHaveBeenCalled()
  })

  it('rejects order when table is hidden', async () => {
    mockTableFindUniqueOrThrow.mockResolvedValueOnce({
      number: 1,
      status: TableStatus.Hidden
    })

    await expect(
      guestCreateOrdersController(1, [
        {
          dishId: 1,
          quantity: 2
        }
      ])
    ).rejects.toThrow()

    expect(mockOrderCreate).not.toHaveBeenCalled()
  })

  it('rejects order when table is reserved', async () => {
    mockTableFindUniqueOrThrow.mockResolvedValueOnce({
      number: 1,
      status: TableStatus.Reserved
    })

    await expect(
      guestCreateOrdersController(1, [
        {
          dishId: 1,
          quantity: 2
        }
      ])
    ).rejects.toThrow()

    expect(mockOrderCreate).not.toHaveBeenCalled()
  })

  it('rejects order when dish is unavailable', async () => {
    mockDishFindUniqueOrThrow.mockResolvedValueOnce({
      id: 1,
      name: 'Nasi Goreng',
      status: DishStatus.Unavailable
    })

    await expect(
      guestCreateOrdersController(1, [
        {
          dishId: 1,
          quantity: 2
        }
      ])
    ).rejects.toThrow()

    expect(mockOrderCreate).not.toHaveBeenCalled()
  })

  it('rejects order when dish is hidden', async () => {
    mockDishFindUniqueOrThrow.mockResolvedValueOnce({
      id: 1,
      name: 'Nasi Goreng',
      status: DishStatus.Hidden
    })

    await expect(
      guestCreateOrdersController(1, [
        {
          dishId: 1,
          quantity: 2
        }
      ])
    ).rejects.toThrow()

    expect(mockOrderCreate).not.toHaveBeenCalled()
  })
})
