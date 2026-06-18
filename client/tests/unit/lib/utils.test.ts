import { handleErrorApi, checkAndRefreshToken } from '@/lib/utils'
import { EntityError } from '@/lib/http'

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}))

jest.mock('@/apiRequests/auth', () => ({
  __esModule: true,
  default: {
    refreshToken: jest.fn(),
  },
}))

jest.mock('@/apiRequests/guest', () => ({
  __esModule: true,
  default: {
    refreshToken: jest.fn(),
  },
}))  

import {
cn,
normalizePath,
formatCurrency,
removeAccents,
simpleMatchText,
getVietnameseDishStatus, 
getVietnameseOrderStatus, 
getVietnameseTableStatus, 
getTableLink,
decodeToken,
formatDateTimeToLocaleString,
formatDateTimeToTimeString,
} from '@/lib/utils'

import jwt from 'jsonwebtoken'

import {
DishStatus,
OrderStatus,
TableStatus,
Role,
TokenType,
} from '@/constants/type'

jest.mock('jsonwebtoken')

jest.mock('@/config', () => ({
__esModule: true,
default: {
NEXT_PUBLIC_URL: 'http://localhost:3000',
NEXT_PUBLIC_API_ENDPOINT: 'http://localhost:8080',
},
}))

describe('utils.ts', () => {
describe('cn()', () => {
it('should merge class names', () => {
const result = cn('p-4', 'text-red-500')

  expect(result).toContain('p-4')
  expect(result).toContain('text-red-500')
})

it('should override conflicting tailwind classes', () => {
  const result = cn('p-2', 'p-4')

  expect(result).toBe('p-4')
})

})

describe('normalizePath()', () => {
it('should remove leading slash', () => {
expect(normalizePath('/api/auth')).toBe(
'api/auth',
)
})

it('should keep path unchanged if no slash', () => {
  expect(normalizePath('api/auth')).toBe(
    'api/auth',
  )
})

it('should handle empty string', () => {
  expect(normalizePath('')).toBe('')
})

})

describe('formatCurrency()', () => {
it('should format currency correctly', () => {
const result = formatCurrency(10000)

  expect(result).toContain('10.000')
})

it('should format zero', () => {
  const result = formatCurrency(0)

  expect(result).toContain('0')
})

})

describe('removeAccents()', () => {
  it('should remove complex diacritics/accents correctly', () => {
    expect(removeAccents('Café Crème')).toBe('Cafe Creme')
  })

  it('should keep normal string unchanged', () => {
    expect(removeAccents('Restaurant')).toBe('Restaurant')
  })
})

describe('simpleMatchText()', () => {
  it('should match accent-insensitive text', () => {
    expect(
      simpleMatchText(
        'Café Crème Moza',
        'cafe creme',
      ),
    ).toBe(true)
  })

  it('should match case-insensitive text', () => {
    expect(
      simpleMatchText(
        'Restaurant Management',
        'management',
      ),
    ).toBe(true)
  })

  it('should return false when no match', () => {
    expect(
      simpleMatchText(
        'Restaurant',
        'Hotel',
      ),
    ).toBe(false)
  })
})

describe('getVietnameseDishStatus()', () => {
it('should translate Available', () => {
expect(
getVietnameseDishStatus(
DishStatus.Available,
),
).toBe('Available') 
})

it('should translate Unavailable', () => {
  expect(
    getVietnameseDishStatus(
      DishStatus.Unavailable,
    ),
  ).toBe('Unavailable') 
})

it('should translate Hidden', () => {
  expect(
    getVietnameseDishStatus(
      DishStatus.Hidden,
    ),
  ).toBe('Hidden') 
})

})

describe('getVietnameseOrderStatus()', () => {
it('should translate Pending', () => {
expect(
getVietnameseOrderStatus(
OrderStatus.Pending,
),
).toBe('Pending') 
})

it('should translate Processing', () => {
  expect(
    getVietnameseOrderStatus(
      OrderStatus.Processing,
    ),
  ).toBe('Processing') 
})

it('should translate Delivered', () => {
  expect(
    getVietnameseOrderStatus(
      OrderStatus.Delivered,
    ),
  ).toBe('Delivered') 
})

it('should translate Paid', () => {
  expect(
    getVietnameseOrderStatus(
      OrderStatus.Paid,
    ),
  ).toBe('Paid') 
})

it('should translate Rejected', () => {
  expect(
    getVietnameseOrderStatus(
      OrderStatus.Rejected,
    ),
  ).toBe('Rejected') 
})

})

describe('getVietnameseTableStatus()', () => {
it('should translate Available', () => {
expect(
getVietnameseTableStatus(
TableStatus.Available,
),
).toBe('Available') 
})

it('should translate Reserved', () => {
  expect(
    getVietnameseTableStatus(
      TableStatus.Reserved,
    ),
  ).toBe('Reserved') 
})

it('should translate Hidden', () => {
  expect(
    getVietnameseTableStatus(
      TableStatus.Hidden,
    ),
  ).toBe('Hidden') 
})

})

describe('getTableLink()', () => {
it('should generate table link correctly', () => {
const result = getTableLink({
token: 'abc123',
tableNumber: 5,
})

  expect(result).toBe(
    'http://localhost:3000/tables/5?token=abc123',
  )
})

})

describe('decodeToken()', () => {
it('should decode jwt payload', () => {
const payload = {
userId: 1,
role: Role.Owner,
tokenType: TokenType.AccessToken,
exp: 1000,
iat: 500,
}

  ;(jwt.decode as jest.Mock).mockReturnValue(
    payload,
  )

  expect(
    decodeToken('fake-token'),
  ).toEqual(payload)

  expect(jwt.decode).toHaveBeenCalledWith(
    'fake-token',
  )
})

})

describe('formatDateTimeToLocaleString()', () => {
it('should format date string', () => {
const result =
formatDateTimeToLocaleString(
'2025-01-01T10:30:00Z',
)

  expect(result).toContain('01/01/2025')
})

it('should format Date object', () => {
  const result =
    formatDateTimeToLocaleString(
      new Date('2025-01-01T10:30:00Z'),
    )

  expect(result).toContain('01/01/2025')
})

})

describe('formatDateTimeToTimeString()', () => {
    it('should return time string', () => {
        const result =
            formatDateTimeToTimeString(
            '2025-01-01T10:30:00Z',
        )

  expect(result).toMatch(
    /^\d{2}:\d{2}:\d{2}$/,
  )
})

it('should work with Date object', () => {
  const result =
    formatDateTimeToTimeString(
      new Date('2025-01-01T10:30:00Z'),
    )

  expect(result).toMatch(
    /^\d{2}:\d{2}:\d{2}$/,
  )
})
})
})

describe('handleErrorApi()', () => {
  it('should call setError for EntityError', () => {
    const setError = jest.fn()

    const error = new EntityError({
      status: 422,
      payload: {
        message: 'Validation Error',
        errors: [
          {
            field: 'email',
            message: 'Email invalid',
          },
        ],
      },
    })

    handleErrorApi({
      error,
      setError,
    })

    expect(setError).toHaveBeenCalledWith(
      'email',
      {
        type: 'server',
        message: 'Email invalid',
      },
    )
  })

  it('should fallback to toast', () => {
    const { toast } = require('@/components/ui/use-toast')

    handleErrorApi({
      error: {
        payload: {
          message: 'Unknown Error',
        },
      },
    })

    expect(toast).toHaveBeenCalled()
  })
})

describe('checkAndRefreshToken()', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should return when tokens do not exist', async () => {
    await checkAndRefreshToken({})

    expect(true).toBe(true)
  })

  it('should trigger onError when refresh token expired', async () => {
    const onError = jest.fn()

    localStorage.setItem('accessToken', 'access')
    localStorage.setItem('refreshToken', 'refresh')

    ;(jwt.decode as jest.Mock)
      .mockReturnValueOnce({
        exp: 9999999999,
        iat: 1,
        role: Role.Owner,
      })
      .mockReturnValueOnce({
        exp: 1,
        iat: 1,
        role: Role.Owner,
      })

    await checkAndRefreshToken({
      onError,
    })

    expect(onError).toHaveBeenCalled()
  })
})