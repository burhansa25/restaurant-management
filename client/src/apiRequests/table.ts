import http from '@/lib/http'
import { CreateTableBodyType, TableListResType, TableResType, UpdateTableBodyType } from '@/schemas/table.schema'

const tableApi = {
  getListTables: () => http.get<TableListResType>('tables'),

  createTable: (body: CreateTableBodyType) => http.post<TableResType>('tables', body),

  getTableById: (id: number) => http.get<TableResType>(`tables/${id}`),

  updateTable: (id: number, body: UpdateTableBodyType) => http.put<TableResType>(`tables/${id}`, body),

  deleteTable: (id: number) => http.delete<TableResType>(`tables/${id}`),
}

export default tableApi
