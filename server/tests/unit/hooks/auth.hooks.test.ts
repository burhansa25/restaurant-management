import { Role } from '@/constants/type'
import { AuthError } from '@/utils/errors'
import { signAccessToken } from '@/utils/jwt'
import { requireLoginedHook, requireOwnerHook, requireEmployeeHook, requireGuestHook } from '@/hooks/auth.hooks'

describe('auth hooks', () => {
  it('throws AuthError when no access token is provided', async () => {
    await expect(requireLoginedHook({ headers: {} } as any)).rejects.toBeInstanceOf(AuthError)
  })

  it('throws AuthError when access token is invalid', async () => {
    await expect(requireLoginedHook({ headers: { authorization: 'Bearer invalid' } } as any)).rejects.toBeInstanceOf(
      AuthError
    )
  })

  it('attaches decoded token on valid access token', async () => {
    const token = signAccessToken({ userId: 2, role: Role.Owner })
    const request: any = { headers: { authorization: `Bearer ${token}` } }

    await requireLoginedHook(request)

    expect(request.decodedAccessToken).toBeDefined()
    expect(request.decodedAccessToken.userId).toBe(2)
    expect(request.decodedAccessToken.role).toBe(Role.Owner)
  })

  it('allows owner hook only for owner role', async () => {
    const request: any = { decodedAccessToken: { role: Role.Owner } }
    await expect(requireOwnerHook(request)).resolves.toBeUndefined()
  })

  it('rejects owner hook for employee', async () => {
    const request: any = { decodedAccessToken: { role: Role.Employee } }
    await expect(requireOwnerHook(request)).rejects.toBeInstanceOf(AuthError)
  })

  it('allows employee hook only for employee role', async () => {
    const request: any = { decodedAccessToken: { role: Role.Employee } }
    await expect(requireEmployeeHook(request)).resolves.toBeUndefined()
  })

  it('rejects employee hook for owner', async () => {
    const request: any = { decodedAccessToken: { role: Role.Owner } }
    await expect(requireEmployeeHook(request)).rejects.toBeInstanceOf(AuthError)
  })

  it('allows guest hook only for guest role', async () => {
    const request: any = { decodedAccessToken: { role: Role.Guest } }
    await expect(requireGuestHook(request)).resolves.toBeUndefined()
  })

  it('rejects guest hook for owner', async () => {
    const request: any = { decodedAccessToken: { role: Role.Owner } }
    await expect(requireGuestHook(request)).rejects.toBeInstanceOf(AuthError)
  })
})
