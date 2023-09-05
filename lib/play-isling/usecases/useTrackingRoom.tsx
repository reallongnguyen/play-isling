import { useMutation } from '@tanstack/react-query'
import { addAction } from '../repo/api'
import { useEffect, useRef } from 'react'

export default function useTrackingRoom(roomId?: number) {
  const joinedAt = useRef(Date.now())
  const { mutate } = useMutation({
    mutationFn: addAction,
  })

  useEffect(() => {
    joinedAt.current = Date.now()
  }, [roomId])

  useEffect(() => {
    if (roomId === undefined) {
      return
    }

    mutate({
      type: 'read',
      objectId: String(roomId),
    })

    const id = setInterval(() => {
      if (
        Date.now() - joinedAt.current >= 3 * 60000 &&
        Date.now() - joinedAt.current < 4 * 60000
      ) {
        mutate({
          type: 'watch-3min',
          objectId: String(roomId),
        })
      }

      if (
        Date.now() - joinedAt.current >= 15 * 60000 &&
        Date.now() - joinedAt.current < 16 * 60000
      ) {
        mutate({
          type: 'watch-15min',
          objectId: String(roomId),
        })
      }

      if (
        Date.now() - joinedAt.current >= 60 * 60000 &&
        Date.now() - joinedAt.current < 61 * 60000
      ) {
        mutate({
          type: 'watch-1h',
          objectId: String(roomId),
        })
      }
    }, 60000)

    return () => {
      clearInterval(id)
    }
  }, [mutate, roomId])

  return {
    trackAction: mutate,
  }
}
