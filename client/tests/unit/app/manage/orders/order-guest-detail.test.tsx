import {
  render,
  screen,
} from '@testing-library/react'
import React from 'react'

import OrderGuestDetail from '@/app/manage/orders/order-guest-detail'
import { OrderStatus } from '@/constants/type'

jest.mock('@/queries/useOrder', () => ({
  usePayGuestOrdersMutation: () => ({
    isPending: false,
    mutateAsync: jest.fn(),
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => React.createElement('img', props),
}))

const guest = {
  id: 1,
  name: 'Guest',
  tableNumber: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const createOrder = (note: string | null) => ({
  id: 1,
  guestId: 1,
  guest,
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
  note,
  orderHandlerId: null,
  orderHandler: null,
  status: OrderStatus.Pending,
  createdAt: new Date(),
  updatedAt: new Date(),
})

describe('OrderGuestDetail', () => {
  it('renders order note when available', () => {
    render(
      <OrderGuestDetail
        guest={guest}
        orders={[
          createOrder('Tidak pedas'),
        ] as any}
      />,
    )

    expect(
      screen.getByText('Catatan:'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Tidak pedas'),
    ).toBeInTheDocument()
  })

  it('does not render order note label when note is null', () => {
    render(
      <OrderGuestDetail
        guest={guest}
        orders={[
          createOrder(null),
        ] as any}
      />,
    )

    expect(
      screen.queryByText('Catatan:'),
    ).not.toBeInTheDocument()
  })
})
