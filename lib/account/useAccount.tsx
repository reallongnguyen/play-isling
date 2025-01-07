import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserProfile } from './repo/api'
import { ErrorResponse, SuccessResponse } from '../common/models/api-response'
import { getToken, removeToken } from './repo/token'
import Profile from './models/profile'

export interface UseAccountProps {
  mustLogin?: boolean
}

const profileCacheTTL = 10 * 60 * 1000 // ms
const defaultConfig: UseAccountProps = {
  mustLogin: false,
}

export default function useAccount(orgProps?: UseAccountProps) {
  const props = Object.assign({}, defaultConfig, orgProps)
  const { mustLogin } = props
  const [hasToken, setHasToken] = useState(false)
  const [isTokenLoading, setIsTokenLoading] = useState(true)

  const router = useRouter()
  const {
    data: userProfileRes,
    isLoading,
    refetch: refetchProfile,
  } = useQuery<SuccessResponse<Profile>, ErrorResponse>({
    queryFn: getUserProfile,
    staleTime: profileCacheTTL, // enable cache
    queryKey: ['fetchUserProfile'],
    enabled: hasToken,
    retry: (fCount, error) => {
      return fCount < 8 && error.code / 100 >= 5
    },
    retryDelay: (failCount) => 100 * 2 ** Math.min(failCount, 9),
  })
  const hasAuth = Boolean(userProfileRes) || hasToken

  useEffect(() => {
    // force logout to use offline mode
    removeToken()

    const token = getToken()
    setIsTokenLoading(false)

    if (!token && mustLogin) {
      router.push('/signin')

      return
    }

    if (token) {
      setHasToken(true)
    }
  }, [mustLogin, router])

  useEffect(() => {
    if (
      userProfileRes &&
      userProfileRes.data &&
      !userProfileRes.data.firstName
    ) {
      const nextStep = '/all-done'
      router.push(`/me/profile/edit?next=${nextStep}`)
    }
  }, [router, userProfileRes])

  return {
    hasAuth,
    userProfile: userProfileRes?.data,
    isLoading: isTokenLoading || (hasToken && isLoading),
    refetchProfile,
  }
}
