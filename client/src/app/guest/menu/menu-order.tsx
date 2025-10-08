'use client'
import Quantity from '@/app/guest/menu/quantity'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { useGetAllDishes } from '@/queries/useDish'
import { GuestCreateOrdersBodyType } from '@/schemas/guest.schema'
import Image from 'next/image'
import { useState } from 'react'

export default function MenuOrder() {
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const { data } = useGetAllDishes()
  const dishes = data?.payload.data || []

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prev) => {
      if (quantity === 0) {
        return prev.filter((item) => item.dishId !== dishId)
        // lấy tất cả các item mà khác dishId
      }
      const index = prev.findIndex((item) => item.dishId === dishId)
      if (index === -1) {
        // chưa có món này trong giỏ hàng
        return [...prev, { dishId, quantity }]
      }
      // đã có món này trong giỏ hàng
      const newOrders = [...prev]
      newOrders[index].quantity = quantity
      return newOrders
    })
  }

  const totalPrice = orders.reduce((total, order) => {
    const dish = dishes.find((d) => d.id === order.dishId)
    if (dish) {
      return total + dish.price * order.quantity
    }
    return total
  }, 0)

  console.log(orders)
  return (
    <>
      <h1 className="text-center text-xl font-bold">🍕 Menu quán</h1>
      {dishes.map((dish) => (
        <div key={dish.id} className="flex gap-4">
          <div className="flex-shrink-0">
            <Image
              src={dish.image}
              alt={dish.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{dish.name}</h3>
            <p className="text-xs">{dish.description}</p>
            <p className="text-xs font-semibold">{formatCurrency(dish.price)}</p>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Quantity
              value={orders.find((item) => item.dishId === dish.id)?.quantity || 0}
              onChange={(value) => handleQuantityChange(dish.id, value)}
            />
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <Button className="w-full justify-between">
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
