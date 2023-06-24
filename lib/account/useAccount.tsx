import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserProfile } from './repo/api'
import ApiResponse, { ErrorResponse } from '../common/models/api-response'
import { getToken } from './repo/token'
import Profile from './models/profile'

const profileCacheTTL = 10 * 60 * 1000 // ms
const defaultConfig = {
  mustLogin: true,
}

export default function useAccount({ mustLogin } = defaultConfig) {
  const [hasToken, setHasToken] = useState(false)

  const router = useRouter()
  const {
    data: userProfileRes,
    isLoading,
    isPending,
    refetch: refetchProfile,
  } = useQuery<ApiResponse<Profile>, ErrorResponse>({
    queryFn: getUserProfile,
    staleTime: profileCacheTTL, // enable cache
    queryKey: ['fetchUserProfile'],
    retry: (fCount, error) => {
      return fCount < 8 && error.code / 100 >= 5
    },
    retryDelay: (failCount) => 100 * 2 ** Math.min(failCount, 9),
  })
  const hasAuth = Boolean(userProfileRes) || hasToken

  useEffect(() => {
    const token = getToken()

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
      router.push('/me/profile/edit')
    }
  }, [router, userProfileRes])

  return {
    hasAuth,
    userProfile: userProfileRes?.data,
    isLoading: !hasAuth && (isLoading || isPending),
    refetchProfile,
  }
}
