import { Role } from '@/constants/type'
import { hashPassword } from '@/utils/crypto'
import { signRefreshToken } from '@/utils/jwt'
import { AuthError, EntityError } from '@/utils/errors'

const mockAccountFindUnique = jest.fn()
const mockRefreshTokenCreate = jest.fn()
const mockRefreshTokenDelete = jest.fn()
const mockRefreshTokenFindUniqueOrThrow = jest.fn()

jest.mock('@/database', () => ({
  __esModule: true,
  default: {
    account: {
      findUnique: mockAccountFindUnique
    },
    refreshToken: {
      create: mockRefreshTokenCreate,
      delete: mockRefreshTokenDelete,
      findUniqueOrThrow: mockRefreshTokenFindUniqueOrThrow
    }
  }
}))

import { loginController, logoutController, refreshTokenController } from '@/controllers/auth.controller'

describe('auth.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('logs in an existing account and stores refresh token', async () => {
    const password = 'password'
    const account = {
      id: 1,
      name: 'Owner',
      email: 'owner@test.com',
      password: await hashPassword(password),
      role: Role.Owner
    }

    mockAccountFindUnique.mockResolvedValue(account)
    mockRefreshTokenCreate.mockResolvedValue({})

    const result = await loginController({ email: account.email, password })

    expect(result.account).toEqual(expect.objectContaining({ id: 1, email: account.email }))
    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
    expect(mockAccountFindUnique).toHaveBeenCalledWith({ where: { email: account.email } })
    expect(mockRefreshTokenCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          accountId: account.id,
          token: result.refreshToken,
          expiresAt: expect.any(Date)
        })
      })
    )
  })

  it('throws EntityError when email does not exist', async () => {
    mockAccountFindUnique.mockResolvedValue(null)

    await expect(loginController({ email: 'missing@test.com', password: 'password' })).rejects.toBeInstanceOf(
      EntityError
    )
    expect(mockRefreshTokenCreate).not.toHaveBeenCalled()
  })

  it('throws EntityError when password is incorrect', async () => {
    const account = {
      id: 1,
      name: 'Owner',
      email: 'owner@test.com',
      password: await hashPassword('correct-password'),
      role: Role.Owner
    }

    mockAccountFindUnique.mockResolvedValue(account)

    await expect(loginController({ email: account.email, password: 'wrong-password' })).rejects.toBeInstanceOf(
      EntityError
    )
    expect(mockRefreshTokenCreate).not.toHaveBeenCalled()
  })

  it('refreshes token when refresh token is valid', async () => {
    const refreshToken = signRefreshToken({ userId: 1, role: Role.Owner })
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

    mockRefreshTokenFindUniqueOrThrow.mockResolvedValue({
      token: refreshToken,
      account: { id: 1, role: Role.Owner },
      expiresAt
    })
    mockRefreshTokenDelete.mockResolvedValue({})
    mockRefreshTokenCreate.mockResolvedValue({})

    const result = await refreshTokenController(refreshToken)

    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
    expect(mockRefreshTokenDelete).toHaveBeenCalledWith({ where: { token: refreshToken } })
    expect(mockRefreshTokenCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          accountId: 1,
          token: result.refreshToken,
          expiresAt
        })
      })
    )
  })

  it('throws AuthError when refresh token is invalid', async () => {
    await expect(refreshTokenController('invalid-token')).rejects.toBeInstanceOf(AuthError)
  })

  it('logs out successfully and deletes the refresh token', async () => {
    mockRefreshTokenDelete.mockResolvedValue({})

    const message = await logoutController('some-refresh-token')

    expect(message).toBe('Đăng xuất thành công')
    expect(mockRefreshTokenDelete).toHaveBeenCalledWith({ where: { token: 'some-refresh-token' } })
  })
})
