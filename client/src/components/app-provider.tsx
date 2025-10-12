/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RefreshToken from './refresh-token'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeAccessTokenFromLocalStorage,
  removeRefreshTokenFromLocalStorage,
} from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
})
export const useAppContext = () => useContext(AppContext)

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<RoleType | undefined>(undefined)

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const role = decodeToken(accessToken).role
      setRoleState(role)
    }
  }, [])

  const setRole = useCallback((role?: RoleType | undefined) => {
    if (role) {
      setRoleState(role)
    } else {
      setRoleState(undefined)
      removeAccessTokenFromLocalStorage()
      removeRefreshTokenFromLocalStorage()
    }
  }, [])

  const isAuth = Boolean(role)

  //react19 and nextjs 15 don't need AppContext.Provider
  return (
    <AppContext value={{ role, setRole, isAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext>
  )
}
