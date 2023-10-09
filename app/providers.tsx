'use client'
import { RecoilRoot } from 'recoil'
import '@/services/initFirebase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { configAxiosInterceptor } from '@/lib/account/repo/axiosConfig'
import { useToast } from '@/components/atoms/use-toast'
import { surreal } from '@/lib/common/repo/surreal'
import { useEffect } from 'react'

configAxiosInterceptor()

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  useToast()

  useEffect(() => {
    surreal.signin()
    surreal.autoReconnect()
  }, [])

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RecoilRoot>
  )
}
