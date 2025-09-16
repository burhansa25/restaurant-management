'use client'

import { useAppContext } from '@/components/app-provider'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRef } from 'react'

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const { setIsAuth } = useAppContext()
  const searchParams = useSearchParams()
  const refreshTokenFromURL = searchParams.get('refreshToken')
  const accessTokenFromURL = searchParams.get('accessToken')
  // lấy refreshToken từ query param
  const isLoggingOut = useRef(null)
  // tạo một biến để giữ trạng thái đăng xuất, tránh việc gọi nhiều lần
  useEffect(() => {
    if (
      !isLoggingOut.current &&
      ((refreshTokenFromURL && refreshTokenFromURL === getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromURL && accessTokenFromURL === getAccessTokenFromLocalStorage()))
    ) {
      mutateAsync().then(() => {
        setTimeout(() => {
          isLoggingOut.current = null
        }, 10)
        // setTimeout để tránh việc user logout duplicate
        setIsAuth(false)
        router.push('/login')
      })
    } else {
      // trường hợp hi hữu là token khi refreshToken hoặc accessToken không hợp lệ hoặc không khớp -> tránh dừng lại ở page này
      router.push('/')
    }
  }, [mutateAsync, router, refreshTokenFromURL, accessTokenFromURL])

  return <div>Logging out...</div>
}
