'use client'
import { RecoilRoot } from 'recoil'
import '@/services/initFirebase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { configAxiosInterceptor } from '@/lib/account/repo/axiosConfig'
import { useToast } from '@/components/atoms/use-toast'
import initSurreal from '@/lib/common/repo/surreal/initial'

configAxiosInterceptor()

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  useToast()
  initSurreal()

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RecoilRoot>
  )
}
