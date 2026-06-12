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
  ManagerRoom,
} from '@/constants/type'

describe('type constants', () => {
  it('should contain correct token types', () => {
    expect(TokenType.AccessToken).toBe('AccessToken')
    expect(TokenType.RefreshToken).toBe('RefreshToken')
    expect(TokenType.ForgotPasswordToken).toBe('ForgotPasswordToken')
    expect(TokenType.TableToken).toBe('TableToken')
  })

  it('should contain correct roles', () => {
    expect(Role.Owner).toBe('Owner')
    expect(Role.Employee).toBe('Employee')
    expect(Role.Guest).toBe('Guest')
  })

  it('should contain role values', () => {
    expect(RoleValues).toEqual(['Owner', 'Employee', 'Guest'])
  })

  it('should contain dish statuses', () => {
    expect(DishStatusValues).toEqual([
      'Available',
      'Unavailable',
      'Hidden',
    ])
  })

  it('should contain table statuses', () => {
    expect(TableStatusValues).toEqual([
      'Available',
      'Hidden',
      'Reserved',
    ])
  })

  it('should contain order statuses', () => {
    expect(OrderStatusValues).toEqual([
      'Pending',
      'Processing',
      'Rejected',
      'Delivered',
      'Paid',
    ])
  })

  it('should contain manager room constant', () => {
    expect(ManagerRoom).toBe('manager')
  })
})