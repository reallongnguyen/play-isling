'use client'
import RoomHeader, {
  RoomHeaderProps,
} from '@/components/templates/headers/RoomHeader'
import RoomHeaderForGuest from '@/components/templates/headers/RoomHeaderForGuest'
import useAccount from '@/lib/account/useAccount'
import { getRoomURL } from '@/lib/play-isling/models/Room'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

const RoomHeaderWrapper: FC<Omit<RoomHeaderProps, 'userProfile'>> = (props) => {
  const { userProfile } = useAccount({ mustLogin: false })

  const { room } = props
  const pathName = usePathname()
  const isLivingRoom = room && pathName === getRoomURL(room)
  const backBtnConfig =
    !room || isLivingRoom
      ? { url: '/', title: 'Home' }
      : { url: getRoomURL(room), title: room.name }

  return (
    <>
      {!userProfile ? (
        <RoomHeaderForGuest {...props} backBtn={backBtnConfig} />
      ) : (
        <RoomHeader
          {...props}
          backBtn={backBtnConfig}
          userProfile={userProfile}
        />
      )}
    </>
  )
}

export default RoomHeaderWrapper
