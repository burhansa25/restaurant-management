import tableApi from '@/apiRequests/table'
import { queryClient } from '@/components/app-provider'
import { CreateTableBodyType, UpdateTableBodyType } from '@/schemas/table.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useGetListTable = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: () => tableApi.getListTables(),
  })
}

export const useGetTableById = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['tables', id],
    queryFn: () => tableApi.getTableById(id),
    enabled,
  })
}

export const useCreateTableMutation = () => {
  return useMutation({
    mutationFn: (body: CreateTableBodyType) => tableApi.createTable(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'], exact: true })
    },
  })
}

export const useUpdateTableMutation = () => {
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number } & UpdateTableBodyType) => tableApi.updateTable(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}

export const useDeleteTableMutation = () => {
  return useMutation({
    mutationFn: (id: number) => tableApi.deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'], exact: true })
    },
  })
}
