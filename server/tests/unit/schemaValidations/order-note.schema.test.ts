import { OrderStatus } from '@/constants/type'
import { GuestCreateOrdersBody } from '@/schemaValidations/guest.schema'
import { OrderSchema, UpdateOrderBody } from '@/schemaValidations/order.schema'

const baseOrder = {
  id: 1,
  guestId: 1,
  guest: {
    id: 1,
    name: 'Guest',
    tableNumber: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  tableNumber: 1,
  dishSnapshotId: 1,
  dishSnapshot: {
    id: 1,
    name: 'Nasi Goreng',
    price: 10000,
    image: '/dish.jpg',
    description: 'desc',
    status: 'Available',
    dishId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  quantity: 2,
  orderHandlerId: null,
  orderHandler: null,
  status: OrderStatus.Pending,
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('order note schema', () => {
  it('accepts guest order without note', () => {
    expect(
      GuestCreateOrdersBody.parse([
        {
          dishId: 1,
          quantity: 2
        }
      ])
    ).toEqual([
      {
        dishId: 1,
        quantity: 2
      }
    ])
  })

  it('trims guest order note', () => {
    expect(
      GuestCreateOrdersBody.parse([
        {
          dishId: 1,
          quantity: 2,
          note: '  Tidak pedas  '
        }
      ])[0].note
    ).toBe('Tidak pedas')
  })

  it('normalizes empty guest order note to null', () => {
    expect(
      GuestCreateOrdersBody.parse([
        {
          dishId: 1,
          quantity: 2,
          note: '   '
        }
      ])[0].note
    ).toBeNull()
  })

  it('rejects invalid guest order note', () => {
    expect(
      GuestCreateOrdersBody.safeParse([
        {
          dishId: 1,
          quantity: 2,
          note: 'a'.repeat(501)
        }
      ]).success
    ).toBe(false)

    expect(
      GuestCreateOrdersBody.safeParse([
        {
          dishId: 1,
          quantity: 2,
          note: 123
        }
      ]).success
    ).toBe(false)
  })

  it('includes nullable note in order response schema', () => {
    expect(
      OrderSchema.parse({
        ...baseOrder,
        note: 'Tidak pedas'
      }).note
    ).toBe('Tidak pedas')

    expect(
      OrderSchema.parse({
        ...baseOrder,
        note: null
      }).note
    ).toBeNull()
  })

  it('keeps update order body compatible', () => {
    expect(
      UpdateOrderBody.parse({
        status: OrderStatus.Delivered,
        dishId: 1,
        quantity: 1
      })
    ).toEqual({
      status: OrderStatus.Delivered,
      dishId: 1,
      quantity: 1
    })
  })
})
