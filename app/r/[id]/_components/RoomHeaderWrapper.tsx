'use client'
import RoomHeader, {
  RoomHeaderProps,
} from '@/components/templates/headers/RoomHeader'
import { getRoomURL } from '@/lib/play-isling/models/Room'
import { usePathname, useSearchParams } from 'next/navigation'
import { FC } from 'react'

const RoomHeaderWrapper: FC<Omit<RoomHeaderProps, 'userProfile'>> = (props) => {
  const query = useSearchParams()

  const { room } = props
  const pathName = usePathname()
  const isLivingRoom =
    room && getRoomURL(room, query.toString()).startsWith(pathName)
  const backBtnConfig =
    !room || isLivingRoom
      ? { url: '/', title: 'Home' }
      : { url: getRoomURL(room, query.toString()), title: room.name }

  return <RoomHeader {...props} backBtn={backBtnConfig} />
}

export default RoomHeaderWrapper
