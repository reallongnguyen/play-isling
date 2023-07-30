import { Room, getRoomURL } from '../../models/Room'
import useAccount from '@/lib/account/useAccount'
import { toast } from '@/components/atoms/use-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteRoom, getMyRooms } from '../../repo/api'

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
  const {
    data: myRoomsRes,
    isLoading,
    refetch: refetchRooms,
  } = useQuery({
    queryFn: getMyRooms,
    queryKey: ['myRooms'],
    initialData: queryClient.getQueryData(['myRooms']),
  })
  const { mutate: deleteRoomMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteRoom,
    onSuccess() {
      toast({ title: 'Delete room successfully' })
      refetchRooms()
    },
  })

  return {
    userProfile,
    myRooms: myRoomsRes?.data.edges,
    isLoading,
    getShareableLinkHandler,
    deleteRoom: deleteRoomMutate,
    isDeleting,
  }
}
