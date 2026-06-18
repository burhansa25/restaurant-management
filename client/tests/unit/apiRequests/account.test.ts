import accountApi from '@/apiRequests/account'
import http from '@/lib/http'

jest.mock('@/lib/http', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}))

describe('accountApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getMe', async () => {
    await accountApi.getMe()

    expect(http.get).toHaveBeenCalledWith('/accounts/me')
  })

  it('sGetMe', async () => {
    await accountApi.sGetMe('token')

    expect(http.get).toHaveBeenCalledWith(
      '/accounts/me',
      {
        headers: {
          Authorization: 'Bearer token'
        }
      }
    )
  })

  it('updateMe', async () => {
    const body = { name: 'Burhan' }

    await accountApi.updateMe(body as any)

    expect(http.put).toHaveBeenCalled()
  })

  it('changePassword', async () => {
    await accountApi.changePassword({} as any)

    expect(http.put).toHaveBeenCalled()
  })

  it('getListAccount', async () => {
    await accountApi.getListAccount()

    expect(http.get).toHaveBeenCalledWith('/accounts')
  })

  it('createEmployee', async () => {
    await accountApi.createEmployee({} as any)

    expect(http.post).toHaveBeenCalled()
  })

  it('updateEmployee', async () => {
    await accountApi.updateEmployee(5, {} as any)

    expect(http.put).toHaveBeenCalledWith(
      '/accounts/detail/5',
      expect.anything()
    )
  })

  it('getEmployeeDetail', async () => {
    await accountApi.getEmployeeDetail(10)

    expect(http.get).toHaveBeenCalledWith(
      '/accounts/detail/10'
    )
  })

  it('deleteEmployee', async () => {
    await accountApi.deleteEmployee(1)

    expect(http.delete).toHaveBeenCalledWith(
      '/accounts/detail/1'
    )
  })

  it('guestList', async () => {
    const fromDate = new Date('2025-01-01')
    const toDate = new Date('2025-01-02')

    await accountApi.guestList({
      fromDate,
      toDate
    })

    expect(http.get).toHaveBeenCalled()
  })

  it('createGuest', async () => {
    await accountApi.createGuest({} as any)

    expect(http.post).toHaveBeenCalled()
  })
})