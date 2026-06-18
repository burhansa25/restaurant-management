'use client'

import { useAppContext } from '@/components/app-provider'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { useRef } from 'react'

function Logout() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const { setRole, disconnectSocket } = useAppContext()
  const searchParams = useSearchParams()
  const refreshTokenFromURL = searchParams.get('refreshToken')
  const accessTokenFromURL = searchParams.get('accessToken')
  
  // Extract refreshToken from query parameters
  const isLoggingOut = useRef(null)
  
  // Guard flag to prevent redundant concurrent logout requests
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
        // Debounce timeout to handle strict UI re-renders and avoid duplication
        disconnectSocket()
        router.push('/login')
      })
    } else {
      // Fallback redirect if tokens are mismatched or session is invalid
      router.push('/')
    }
  }, [mutateAsync, router, refreshTokenFromURL, accessTokenFromURL, setRole, disconnectSocket])

  return <div>Signing out...</div>
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Logout />
    </Suspense>
  )
}