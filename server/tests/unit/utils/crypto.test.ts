import { comparePassword, hashPassword } from '@/utils/crypto'

describe('Crypto Utility', () => {
  it('should hash password', async () => {
    const hash = await hashPassword('admin123')

    expect(hash).toBeDefined()
    expect(hash).not.toBe('admin123')
  })

  it('should compare correct password', async () => {
    const hash = await hashPassword('admin123')

    const result = await comparePassword('admin123', hash)

    expect(result).toBe(true)
  })

  it('should reject wrong password', async () => {
    const hash = await hashPassword('admin123')

    const result = await comparePassword('wrong-password', hash)

    expect(result).toBe(false)
  })
})
