import tableApi from '@/apiRequests/table'
import http from '@/lib/http'

jest.mock('@/lib/http')

describe('tableApi', () => {
  it('getListTables', async () => {
    await tableApi.getListTables()

    expect(http.get).toHaveBeenCalled()
  })

  it('createTable', async () => {
    await tableApi.createTable({} as any)

    expect(http.post).toHaveBeenCalled()
  })

  it('getTableById', async () => {
    await tableApi.getTableById(1)

    expect(http.get).toHaveBeenCalled()
  })

  it('updateTable', async () => {
    await tableApi.updateTable(1, {} as any)

    expect(http.put).toHaveBeenCalled()
  })

  it('deleteTable', async () => {
    await tableApi.deleteTable(1)

    expect(http.delete).toHaveBeenCalled()
  })
})