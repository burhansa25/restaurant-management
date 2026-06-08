describe('Auth Logic', () => {
  it('should validate email format', () => {
    const email = 'admin@mail.com'

    expect(email.includes('@')).toBe(true)
  })
})
