import { Role } from '@/constants/type'
import { decodeToken } from '@/lib/utils'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const managePaths = ['/manage']
const guestPaths = ['/guest']
const adminPaths = ['/manage/accounts']
const privatePaths = [...managePaths, ...guestPaths]
const unAuthPaths = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // Case 1: Not logged in and accessing a private path
  if (!refreshToken && privatePaths.some((path) => pathname.startsWith(path))) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  // Case 2: Logged in
  if (refreshToken) {
    // Case 2.1: Already logged in and accessing login page — redirect to home
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Case 2.2: Access token expired, refresh token still valid
    if (!accessToken && privatePaths.some((path) => pathname.startsWith(path))) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken as string)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Case 2.3: Accessing with wrong role — redirect to home
    // - required accessToken
    if (accessToken) {
      const role = decodeToken(accessToken).role
      // Guest cannot access manage pages (employee/owner)
      const isGuestToManagePath = role === Role.Guest && managePaths.some((path) => pathname.startsWith(path))
      // Non-guest cannot access guest pages
      const isNotGuestGoToGuestPath = role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path))
      // Non-admin cannot access admin pages
      const isNotAdminToAdminPath = role !== Role.Owner && adminPaths.some((path) => pathname.startsWith(path))

      if (isGuestToManagePath || isNotGuestGoToGuestPath || isNotAdminToAdminPath) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/login', '/manage/:path*', '/guest/:path*'],
}
