import http from '@/lib/http'
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from '@/schemas/dish.schema'

const dishApi = {
  getAllDishes: () => http.get<DishListResType>('dishes', { next: { tags: ['dishes'] } }),

  getDishById: (id: number) => http.get<DishResType>(`dishes/${id}`),

  createDish: (body: CreateDishBodyType) => http.post<DishResType>('dishes', body),

  updateDish: (id: number, body: UpdateDishBodyType) => http.put<DishResType>(`dishes/${id}`, body),

  deleteDish: (id: number) => http.delete<DishResType>(`dishes/${id}`),
}

export default dishApi
