describe('config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('should load valid env', async () => {
    process.env.NEXT_PUBLIC_API_ENDPOINT =
      'http://localhost:3000'

    process.env.NEXT_PUBLIC_URL =
      'http://localhost:3000'

    const config =
      (await import('@/config')).default

    expect(config.NEXT_PUBLIC_API_ENDPOINT)
      .toBe('http://localhost:3000')
  })

  it('should throw when env invalid', async () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    delete process.env.NEXT_PUBLIC_API_ENDPOINT

    await expect(import('@/config'))
      .rejects
      .toThrow()

    errorSpy.mockRestore()
  })
})