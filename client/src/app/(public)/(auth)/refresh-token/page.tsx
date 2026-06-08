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
    // Validating token passed from the middleware redirect
    if (refreshTokenFromURL && refreshTokenFromURL === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathName || '/')
        },
      })
    } else {
      // Fallback redirect if the token is invalid or mismatched to prevent the application from hanging
      router.push('/')
    }
  }, [refreshTokenFromURL, router, redirectPathName])

  return <div>Authenticating session...</div>
}

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Loading, please wait...</div>}>
      <RefreshToken />
    </Suspense>
  )
}