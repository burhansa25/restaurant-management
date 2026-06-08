import { Role } from '@/constants/type'
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from '@/utils/jwt'

describe('jwt utils', () => {
  const payload = {
    userId: 1,
    role: Role.Owner
  }

  it('should sign and verify access token', () => {
    const token = signAccessToken(payload)

    const decoded = verifyAccessToken(token)

    expect(decoded.userId).toBe(1)
    expect(decoded.role).toBe(Role.Owner)
  })

  it('should sign and verify refresh token', () => {
    const token = signRefreshToken(payload)

    const decoded = verifyRefreshToken(token)

    expect(decoded.userId).toBe(1)
    expect(decoded.role).toBe(Role.Owner)
  })

  it('should throw on invalid access token', () => {
    expect(() => verifyAccessToken('invalid-token')).toThrow()
  })

  it('should throw on invalid refresh token', () => {
    expect(() => verifyRefreshToken('invalid-token')).toThrow()
  })
})