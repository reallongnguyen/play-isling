import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getRoom } from '../../repo/api'
import { SuccessResponse } from '@/lib/common/models/api-response'
import { Collection } from '@/lib/common/models/collections'
import { Room } from '../../models/Room'

export function useRoomInfo(slug: string) {
  const queryClient = useQueryClient()
  const { data: roomRes } = useQuery({
    queryFn: getRoom(slug),
    queryKey: ['room', slug],
    initialData: () => {
      const myRoomRes = queryClient.getQueryData<
        SuccessResponse<Collection<Room>>
      >(['myRooms'])
      const room = myRoomRes?.data.edges.find((r) => r.slug === slug)

      console.log('room in cache', room)

      return room ? { data: room } : undefined
    },
  })

  return {
    room: roomRes?.data,
  }
}
