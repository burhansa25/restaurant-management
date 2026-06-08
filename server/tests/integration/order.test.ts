describe('Order Logic', () => {
  it('should calculate total quantity', () => {
    const orders = [{ quantity: 2 }, { quantity: 3 }]

    const total = orders.reduce((sum, item) => sum + item.quantity, 0)

    expect(total).toBe(5)
  })
})
