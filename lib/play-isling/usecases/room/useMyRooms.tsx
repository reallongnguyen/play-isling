import { useCallback, useEffect, useState } from 'react'
import { Room, getRoomURL } from '../../models/Room'
import useAccount from '@/lib/account/useAccount'
import { getForYouRooms } from '../../repo/room/room'
import { toast } from '@/components/atoms/use-toast'

export default function useMyRooms() {
  const { userProfile } = useAccount({ mustLogin: true })
  const [myRooms, setMyRooms] = useState<Room[]>([])

  const getShareableLinkHandler = useCallback(
    (room: Room) => () => {
      const roomURL = [window.location.host, getRoomURL(room)].join('')
      navigator.clipboard.writeText(roomURL)

      toast({
        title: "Copy room's URL to clipboard",
      })
    },
    []
  )

  useEffect(() => {
    const rooms = getForYouRooms()
    setMyRooms(rooms)
  }, [])

  return {
    userProfile,
    myRooms,
    getShareableLinkHandler,
  }
}
