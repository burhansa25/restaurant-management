import accountApi from '@/apiRequests/account'
import { queryClient } from '@/components/app-provider'
import { UpdateEmployeeAccountBodyType } from '@/schemas/account.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useAccountMeQuery = () => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: accountApi.getMe,
  })
}

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApi.updateMe,
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApi.changePassword,
  })
}

export const useAccountListQuery = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountApi.getListAccount,
  })
}

export const useGetEmployeeDetailQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountApi.getEmployeeDetail(id),
    enabled,
  })
}

export const useCreateEmployeeAccountMutation = () => {
  return useMutation({
    mutationFn: accountApi.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'], exact: true })
    },
  })
}

export const useUpdateEmployeeAccountMutation = () => {
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number } & UpdateEmployeeAccountBodyType) =>
      accountApi.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export const useDeleteEmployeeAccountMutation = () => {
  return useMutation({
    mutationFn: accountApi.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'], exact: true })
    },
  })
}
