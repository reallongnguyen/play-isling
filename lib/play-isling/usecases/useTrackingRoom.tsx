import { useMutation } from '@tanstack/react-query'
import { createUserActivity, logCCU } from '../repo/api'
import { useEffect, useRef } from 'react'

export default function useTrackingRoom(roomId?: number) {
  const joinedAt = useRef(Date.now())
  const { mutate } = useMutation({
    mutationFn: createUserActivity,
  })

  useEffect(() => {
    joinedAt.current = Date.now()
  }, [roomId])

  useEffect(() => {
    if (roomId === undefined) {
      return
    }

    mutate({
      eventName: 'read',
      data: {
        itemId: String(roomId),
      },
    })

    const id = setInterval(() => {
      // send watch-15min if user stay in room on 10 minus
      if (
        Date.now() - joinedAt.current >= 10 * 60000 &&
        Date.now() - joinedAt.current < 11 * 60000
      ) {
        mutate({
          eventName: 'watch-15min',
          data: {
            itemId: String(roomId),
          },
        })
      }

      // send watch-1h if user stay in room on 30 minus
      if (
        Date.now() - joinedAt.current >= 30 * 60000 &&
        Date.now() - joinedAt.current < 31 * 60000
      ) {
        mutate({
          eventName: 'watch-1h',
          data: {
            itemId: String(roomId),
          },
        })
      }
    }, 60000)

    return () => {
      clearInterval(id)
    }
  }, [mutate, roomId])

  useEffect(() => {
    if (!roomId) {
      return
    }

    logCCU()

    const id = setInterval(() => {
      logCCU()
    }, 60 * 1000)

    return () => {
      clearInterval(id)
    }
  }, [roomId])

  return {
    logUserActivity: mutate,
  }
}
