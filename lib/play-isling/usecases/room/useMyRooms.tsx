import { Room, getRoomURL } from '../../models/Room'
import useAccount from '@/lib/account/useAccount'
import { toast } from '@/components/atoms/use-toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyRooms } from '../../repo/api'

const getShareableLinkHandler = (room: Room) => () => {
  const roomURL = [window.location.host, getRoomURL(room)].join('')
  navigator.clipboard.writeText(roomURL)

  toast({
    title: "Copy room's URL to clipboard",
  })
}

export default function useMyRooms() {
  const { userProfile } = useAccount({ mustLogin: true })
  const queryClient = useQueryClient()
  const { data: myRoomsRes, isLoading } = useQuery({
    queryFn: getMyRooms,
    queryKey: ['myRooms'],
    initialData: queryClient.getQueryData(['myRooms']),
  })

  return {
    userProfile,
    myRooms: myRoomsRes?.data.edges,
    isLoading,
    getShareableLinkHandler,
  }
}
