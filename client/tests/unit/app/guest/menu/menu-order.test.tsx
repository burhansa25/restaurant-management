import {
  render,
  screen,
} from '@testing-library/react'
import React from 'react'
import userEvent from '@testing-library/user-event'

import MenuOrder from '@/app/guest/menu/menu-order'

const pushMock = jest.fn()
const mutateMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

jest.mock('@/queries/useDish', () => ({
  useGetAllDishes: () => ({
    data: {
      payload: {
        data: [
          {
            id: 1,
            name: 'Nasi Goreng',
            image: '/test.jpg',
            description: 'desc',
            price: 10000,
            status: 'Available',
          },
        ],
      },
    },
  }),
}))

jest.mock('@/queries/useGuest', () => ({
  useGuestOrderMutation: () => ({
    mutateAsync: mutateMock,
  }),
}))

jest.mock('@/app/guest/menu/quantity', () => {
  return function MockQuantity(props: any) {
    return React.createElement(
      'button',
      {
        onClick: () => props.onChange(props.value + 1),
      },
      'Add',
    )
  }
})

describe('MenuOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders dish', () => {
    render(<MenuOrder />)

    expect(
      screen.getByText('Nasi Goreng'),
    ).toBeInTheDocument()
  })

  it('creates order', async () => {
    mutateMock.mockResolvedValue({})

    render(<MenuOrder />)

    await userEvent.click(
      screen.getByText('Add'),
    )

    const buttons =
      screen.getAllByRole('button')

    await userEvent.click(
      buttons[1],
    )

    expect(mutateMock).toHaveBeenCalledWith([
      {
        dishId: 1,
        quantity: 1,
        note: null,
      },
    ])

    expect(pushMock).toHaveBeenCalledWith(
      '/guest/orders',
    )
  })

  it('sends note for the selected item and keeps it when quantity changes', async () => {
    mutateMock.mockResolvedValue({})

    render(<MenuOrder />)

    await userEvent.click(
      screen.getByText('Add'),
    )

    await userEvent.type(
      screen.getByLabelText('Catatan pesanan (opsional)'),
      'Tanpa acar',
    )

    await userEvent.click(
      screen.getByText('Add'),
    )

    const buttons =
      screen.getAllByRole('button')

    await userEvent.click(
      buttons[1],
    )

    expect(mutateMock).toHaveBeenCalledWith([
      {
        dishId: 1,
        quantity: 2,
        note: 'Tanpa acar',
      },
    ])
  })
})
