import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getRoom } from '../../repo/api'
import { SuccessResponse } from '@/lib/common/models/api-response'
import { Collection } from '@/lib/common/models/collections'
import { Room } from '../../models/Room'
import { useEffect, useMemo, useState } from 'react'
import { db, waitSurreal } from '@/lib/common/repo/surreal/initial'
import useAccount from '@/lib/account/useAccount'
import { SimpleUser } from '../../models/User'
import { LiveQueryResponse } from 'surrealdb.js/script/types'

export function useRoomInfo(slug: string, shouldListenAudience = false) {
  const queryClient = useQueryClient()
  const { data: roomRes } = useQuery({
    queryFn: getRoom(slug),
    queryKey: ['room', slug],
    initialData: () => {
      const myRoomRes = queryClient.getQueryData<
        SuccessResponse<Collection<Room>>
      >(['myRooms'])
      const room = myRoomRes?.data.edges.find((r) => r.slug === slug)

      return room ? { data: room } : undefined
    },
  })
  const roomUID = slug.split('-').reverse()[0]
  const { userProfile } = useAccount({ mustLogin: false })
  const [audienceMap, setAudienceMap] = useState<Record<string, SimpleUser>>({})

  const audiences = useMemo(() => {
    const userSet = Object.values(audienceMap).reduce(
      (pv, v) => ({
        ...pv,
        [v.id]: v,
      }),
      {}
    )

    return Object.values(userSet) as SimpleUser[]
  }, [audienceMap])

  useEffect(() => console.log('audiences change', audiences), [audiences])

  // TODO: write joinRoom(), listenRoom(), getAudiences() at repository layer
  // watch audience's list
  useEffect(() => {
    if (!userProfile) {
      return
    }

    let shouldClearJoinRoomBackgroundJob = false

    let leaveRoom = () => {
      shouldClearJoinRoomBackgroundJob = true
    }

    const joinRoom = async () => {
      const query = `relate users:${userProfile.accountId}->join->media_rooms:${roomUID} set time.joined = time::now(), time.pinged = time::now()`

      const res = await db.query(query)

      const joinId = (res as any)[0].result[0].id

      // ping server every 90s
      const updatePingQuery = `update ${joinId} set time.pinged = time::now()`

      const updatePingId = setInterval(() => {
        db.query(updatePingQuery)
      }, 1000 * 90)

      leaveRoom = () => {
        clearInterval(updatePingId)
        db.delete(joinId).then(() => console.log('leaveRoom', joinId))
      }

      if (shouldClearJoinRoomBackgroundJob) {
        leaveRoom()
      }
    }

    interface QueryResult {
      id: string
      users: { id: string; firstName: string; lastName?: string }[]
    }

    const convQRUtoSimpUser = (qru: {
      id: string
      firstName: string
      lastName?: string
    }): SimpleUser => ({
      id: qru.id,
      firstName: qru.firstName,
      lastName: qru.lastName,
    })

    const liveCallback = (
      data: LiveQueryResponse<Record<string, QueryResult | string>>
    ) => {
      switch (data.action) {
        case 'CREATE':
          const newRow = data.result as unknown as QueryResult

          if (newRow.users.length === 0) {
            return
          }

          setAudienceMap((val) => {
            const newVal = { ...val }

            newVal[newRow.id] = convQRUtoSimpUser(newRow.users[0])

            return newVal
          })
          break
        case 'DELETE':
          setAudienceMap((val) => {
            const newVal = { ...val }
            delete newVal[data.result as unknown as string]

            return newVal
          })
          break
        default:
          break
      }
    }

    let shouldClearListenRoomBackgroundJob = false

    let killLive = () => {
      shouldClearListenRoomBackgroundJob = true
    }

    const listenRoom = async () => {
      if (!shouldListenAudience) {
        return
      }

      const res = await db.query(
        `live select id, <-users.* as users from join where out = "media_rooms:${roomUID}"`
      )

      const queryId = res[0].result as string

      await db.listenLive(queryId, liveCallback)

      killLive = () => {
        db.kill(queryId).then(() => console.log('kill live query', queryId))
      }

      if (shouldClearListenRoomBackgroundJob) {
        killLive()
      }
    }

    const getAudiences = async () => {
      if (!shouldListenAudience) {
        return
      }

      const res = await db.query(
        `select id, <-users.* as users from join where out = "media_rooms:${roomUID}" and time::now() - time.pinged < 2m`
      )

      if (res[0] && Array.isArray(res[0].result)) {
        const audienceMapAtNow = res[0].result
          .map((qr) => qr as unknown as QueryResult)
          .reduce((pv, v) => {
            if (v.users.length === 0) {
              return pv
            }

            return {
              ...pv,
              [v.id]: convQRUtoSimpUser(v.users[0]),
            }
          }, {})

        setAudienceMap(audienceMapAtNow)
      }
    }

    waitSurreal()
      .then(() => joinRoom())
      .then(() => listenRoom())
      .then(() => getAudiences())

    return () => {
      leaveRoom()
      killLive()
    }
  }, [roomUID, shouldListenAudience, userProfile])

  return {
    room: roomRes?.data,
    audiences,
  }
}
