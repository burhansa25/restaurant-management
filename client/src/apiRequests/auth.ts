import http from '@/lib/http'
import { LoginBodyType, LoginResType, LogoutBodyType } from '@/schemas/auth.schema'

const authApiRequests = {
  sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body), // server backend của dự án
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, {
      baseUrl: '',
    }),
  // gọi tới route handler
  sLogout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post(
      '/auth/logout',
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      },
    ),
  logout: () =>
    http.post('/api/auth/logout', null, {
      baseUrl: '',
    }),
}

export default authApiRequests
