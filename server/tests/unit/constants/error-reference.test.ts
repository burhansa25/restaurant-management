import * as errors from '@/constants/error-reference'

describe('Error Reference', () => {
  it('should be defined', () => {
    expect(errors).toBeDefined()
  })

  it('should contain at least one key', () => {
    expect(Object.keys(errors).length).toBeGreaterThan(0)
  })
})