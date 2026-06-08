import { Role } from '@/constants/type'
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from '@/utils/jwt'

describe('JWT Utility', () => {
  const payload = {
    userId: 1,
    role: Role.Owner
  }

  it('should sign and verify access token', () => {
    const token = signAccessToken(payload)
    const decoded = verifyAccessToken(token)

    expect(decoded.userId).toBe(payload.userId)
    expect(decoded.role).toBe(payload.role)
  })

  it('should sign and verify refresh token', () => {
    const token = signRefreshToken(payload)
    const decoded = verifyRefreshToken(token)

    expect(decoded.userId).toBe(payload.userId)
    expect(decoded.role).toBe(payload.role)
  })

  it('should generate different tokens', () => {
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    expect(accessToken).not.toBe(refreshToken)
  })
})
