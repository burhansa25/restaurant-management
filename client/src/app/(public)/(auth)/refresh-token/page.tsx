'use client'

import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

function RefreshToken() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshTokenFromURL = searchParams.get('refreshToken')
  const redirectPathName = searchParams.get('redirect')

  useEffect(() => {
    // từ middleware đẩy qua
    if (refreshTokenFromURL && refreshTokenFromURL === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathName || '/')
        },
      })
    } else {
      // trường hợp hi hữu là token khi refreshToken không hợp lệ hoặc không khớp -> tránh dừng lại ở page này
      router.push('/')
    }
  }, [refreshTokenFromURL, router, redirectPathName])

  return <div>Refresh token...</div>
}

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  )
}
