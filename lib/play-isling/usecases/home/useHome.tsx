import useAccount from '@/lib/account/useAccount'
import { useQuery } from '@tanstack/react-query'
import { getHome, getHomeGuest } from '../../repo/api'

export default function useHome() {
  const { userProfile, isLoading: isAccLoading } = useAccount({})
  const { data: homeData, isLoading: isHomeDataLoading } = useQuery({
    queryKey: ['home', userProfile?.accountId],
    queryFn: userProfile ? getHome : getHomeGuest,
    enabled: !isAccLoading,
  })

  return {
    userProfile,
    homeData: homeData?.data,
    isLoading: isAccLoading || isHomeDataLoading,
  }
}
