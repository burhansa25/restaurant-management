import { renderHook } from '@testing-library/react'
import { useOrderService } from '@/app/manage/orders/order.service'
import { OrderStatus } from '@/constants/type'

describe('useOrderService', () => {
  it('should calculate status statistics', () => {
    const orders: any = [
      {
        id: 1,
        guestId: 1,
        tableNumber: 1,
        status: OrderStatus.Pending,
      },
      {
        id: 2,
        guestId: 1,
        tableNumber: 1,
        status: OrderStatus.Paid,
      },
      {
        id: 3,
        guestId: 2,
        tableNumber: 2,
        status: OrderStatus.Delivered,
      },
    ]

    const { result } = renderHook(() =>
      useOrderService(orders),
    )

    expect(
      result.current.statics.status.Pending,
    ).toBe(1)

    expect(
      result.current.statics.status.Paid,
    ).toBe(1)

    expect(
      result.current.statics.status.Delivered,
    ).toBe(1)
  })

  it('should group orders by guest', () => {
    const orders: any = [
      {
        id: 1,
        guestId: 100,
        tableNumber: 1,
        status: OrderStatus.Pending,
      },
      {
        id: 2,
        guestId: 100,
        tableNumber: 1,
        status: OrderStatus.Paid,
      },
    ]

    const { result } = renderHook(() =>
      useOrderService(orders),
    )

    expect(
      result.current.orderObjectByGuestId[100],
    ).toHaveLength(2)
  })

  it('should keep serving guests', () => {
    const orders: any = [
      {
        id: 1,
        guestId: 1,
        tableNumber: 1,
        status: OrderStatus.Pending,
      },
    ]

    const { result } = renderHook(() =>
      useOrderService(orders),
    )

    expect(
      result.current.servingGuestByTableNumber[1][1],
    ).toBeDefined()
  })

  it('should remove guests already paid', () => {
    const orders: any = [
      {
        id: 1,
        guestId: 1,
        tableNumber: 1,
        status: OrderStatus.Paid,
      },
    ]

    const { result } = renderHook(() =>
      useOrderService(orders),
    )

    expect(
      result.current.servingGuestByTableNumber[1],
    ).toBeUndefined()
  })
})