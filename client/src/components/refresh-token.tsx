'use client'

import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATH = ['/login', '/register', '/forgot-password', '/reset-password', '/refresh-token']

export default function RefreshToken() {
  const pathname = usePathname()
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return
    let interval: any = null

    // Phải gọi lần đầu tiên, vì interval phải đợi TIMEOUT mới chạy
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
      },
    })
    // TIMEOUT phải bé hơn thời gian accessToken hết hạn
    const TIMEOUT = 1000
    interval = setInterval(checkAndRefreshToken, TIMEOUT)
    return () => {
      clearInterval(interval)
    }
  }, [pathname])
  return <div>RefreshToken</div>
}
