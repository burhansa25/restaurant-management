import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { HttpError } from '@/lib/http'
import authApi from '@/apiRequests/auth'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) {
    return Response.json({ message: 'Refresh token not found' }, { status: 401 })
  }
  try {
    const { payload } = await authApi.sRefreshToken({
      refreshToken,
    })

    const decodeAccessToken = jwt.decode(payload.data.accessToken) as { exp: number }
    const decodeRefreshToken = jwt.decode(payload.data.refreshToken) as { exp: number }

    cookieStore.set('accessToken', payload.data.accessToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: decodeAccessToken.exp * 1000,
    })

    cookieStore.set('refreshToken', payload.data.refreshToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: decodeRefreshToken.exp * 1000,
    })

    return Response.json(payload)
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      })
    } else {
      return Response.json({ message: `An error occurred during login` }, { status: 401 })
    }
  }
}
