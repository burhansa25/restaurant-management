import dishApi from '@/apiRequests/dish'
import http from '@/lib/http'

jest.mock('@/lib/http')

describe('dishApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getAllDishes', async () => {
    await dishApi.getAllDishes()

    expect(http.get).toHaveBeenCalledWith(
      'dishes',
      {
        next: { tags: ['dishes'] }
      }
    )
  })

  it('getDishById', async () => {
    await dishApi.getDishById(1)

    expect(http.get).toHaveBeenCalledWith(
      'dishes/1'
    )
  })

  it('createDish', async () => {
    await dishApi.createDish({} as any)

    expect(http.post).toHaveBeenCalled()
  })

  it('updateDish', async () => {
    await dishApi.updateDish(1, {} as any)

    expect(http.put).toHaveBeenCalled()
  })

  it('deleteDish', async () => {
    await dishApi.deleteDish(1)

    expect(http.delete).toHaveBeenCalled()
  })
})