import { OrderStatus } from '@/constants/type'
import { GuestCreateOrdersBody } from '@/schemas/guest.schema'
import { OrderSchema } from '@/schemas/order.schema'

const baseOrder = {
  id: 1,
  guestId: 1,
  guest: {
    id: 1,
    name: 'Guest',
    tableNumber: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    updatedAt: new Date(),
  },
  quantity: 2,
  orderHandlerId: null,
  orderHandler: null,
  status: OrderStatus.Pending,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('order schema', () => {
  it('normalizes guest create order note', () => {
    expect(
      GuestCreateOrdersBody.parse([
        {
          dishId: 1,
          quantity: 2,
          note: '  Es sedikit  ',
        },
      ])[0].note,
    ).toBe('Es sedikit')

    expect(
      GuestCreateOrdersBody.parse([
        {
          dishId: 1,
          quantity: 2,
          note: '   ',
        },
      ])[0].note,
    ).toBeNull()
  })

  it('rejects invalid guest create order note', () => {
    expect(
      GuestCreateOrdersBody.safeParse([
        {
          dishId: 1,
          quantity: 2,
          note: 'a'.repeat(501),
        },
      ]).success,
    ).toBe(false)

    expect(
      GuestCreateOrdersBody.safeParse([
        {
          dishId: 1,
          quantity: 2,
          note: 123,
        },
      ]).success,
    ).toBe(false)
  })

  it('includes nullable note in order response', () => {
    expect(
      OrderSchema.parse({
        ...baseOrder,
        note: null,
      }).note,
    ).toBeNull()

    expect(
      OrderSchema.parse({
        ...baseOrder,
        note: 'Tidak pedas',
      }).note,
    ).toBe('Tidak pedas')
  })
})
