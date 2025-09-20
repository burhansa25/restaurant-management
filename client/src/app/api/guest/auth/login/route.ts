import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { HttpError } from '@/lib/http'
import { GuestLoginBodyType } from '@/schemas/guest.schema'
import guestApi from '@/apiRequests/guest'

export async function POST(request: Request) {
  const body = (await request.json()) as GuestLoginBodyType

  const cookieStore = await cookies()
  try {
    const { payload } = await guestApi.sLogin(body)
    const { accessToken, refreshToken } = payload.data
    const decodedAccessToken = jwt.decode(accessToken)
    const decodedRefreshToken = jwt.decode(refreshToken)

    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: new Date((decodedAccessToken as any).exp * 1000),
    })
    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: new Date((decodedRefreshToken as any).exp * 1000),
    })
    return Response.json(payload)
  } catch (error) {
    console.log(error)
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status })
    } else {
      return Response.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
    }
  }
}
