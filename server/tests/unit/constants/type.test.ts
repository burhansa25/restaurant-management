import {
  TokenType,
  Role,
  RoleValues,
  DishStatus,
  DishStatusValues,
  TableStatus,
  TableStatusValues,
  OrderStatus,
  OrderStatusValues,
  ManagerRoom
} from '@/constants/type'

describe('Constants', () => {
  it('should have correct token types', () => {
    expect(TokenType.AccessToken).toBe('AccessToken')
    expect(TokenType.RefreshToken).toBe('RefreshToken')
  })

  it('should have correct roles', () => {
    expect(RoleValues).toContain(Role.Owner)
    expect(RoleValues).toContain(Role.Employee)
    expect(RoleValues).toContain(Role.Guest)
  })

  it('should have correct dish statuses', () => {
    expect(DishStatusValues).toContain(DishStatus.Available)
    expect(DishStatusValues).toContain(DishStatus.Unavailable)
    expect(DishStatusValues).toContain(DishStatus.Hidden)
  })

  it('should have correct table statuses', () => {
    expect(TableStatusValues).toContain(TableStatus.Available)
    expect(TableStatusValues).toContain(TableStatus.Hidden)
    expect(TableStatusValues).toContain(TableStatus.Reserved)
  })

  it('should have correct order statuses', () => {
    expect(OrderStatusValues).toContain(OrderStatus.Pending)
    expect(OrderStatusValues).toContain(OrderStatus.Processing)
    expect(OrderStatusValues).toContain(OrderStatus.Rejected)
    expect(OrderStatusValues).toContain(OrderStatus.Delivered)
    expect(OrderStatusValues).toContain(OrderStatus.Paid)
  })

  it('should have manager room constant', () => {
    expect(ManagerRoom).toBe('manager')
  })
})
