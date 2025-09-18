import dishApi from '@/apiRequests/dish'
import { CreateDishBodyType, UpdateDishBodyType } from '@/schemas/dish.schema'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/components/app-provider'

export const useGetAllDishes = () => {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: () => dishApi.getAllDishes(),
  })
}

export const useGetDishById = (id: number) => {
  return useQuery({
    queryKey: ['dishes', id],
    queryFn: () => dishApi.getDishById(id),
  })
}

export const useCreateDishMutation = () => {
  return useMutation({
    mutationFn: (body: CreateDishBodyType) => dishApi.createDish(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes'],
      })
    },
  })
}

export const useUpdateDishMutation = () => {
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number } & UpdateDishBodyType) => dishApi.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes'],
      })
    },
  })
}

export const useDeleteDishMutation = () => {
  return useMutation({
    mutationFn: (id: number) => dishApi.deleteDish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes'],
      })
    },
  })
}
