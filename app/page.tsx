'use client'
import { IoPersonOutline } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import { getAvatarString } from '@/lib/common/user'
import Roll from '@com/organisms/Roll'
import { Room } from '@/lib/play-isling/models/Room'
import { getForYouRooms } from '@/lib/play-isling/repo/room/room'
import HomeHeader from '@/components/templates/headers/HomeHeader'
import { Avatar, AvatarFallback } from '@/components/atoms/avatar'
import HomeHeaderForGuest from '@/components/templates/headers/HomeHeaderForGuest'
import {
  LoadingHeader,
  LoadingScreen,
} from '@/components/atoms/loading-skeleton'
import useAccount from '@/lib/account/useAccount'
import { getDisplayName } from '@/lib/account/models/profile'
import RoomCard from '@/components/organisms/room/room-card'

function Page() {
  const { userProfile, isLoading: isLoadingAuth } = useAccount({
    mustLogin: false,
  })
  const [forYouRooms, setForYouRooms] = useState<Room[]>([])

  useEffect(() => {
    const rooms = getForYouRooms()
    setForYouRooms(rooms)
  }, [])

  return (
    <>
      {isLoadingAuth && <LoadingHeader />}
      {isLoadingAuth && <LoadingScreen />}
      <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
        {!userProfile ? (
          <HomeHeaderForGuest />
        ) : (
          <HomeHeader userProfile={userProfile} />
        )}
      </header>
      <div className="h-28" />
      <div className="mx-32">
        <Roll
          title={
            <div className="flex pb-2">
              <Avatar className="w-16 h-16">
                <AvatarFallback>
                  {!userProfile ? (
                    <IoPersonOutline className="text-2xl" />
                  ) : (
                    <div className="text-2xl">
                      {getAvatarString(getDisplayName(userProfile))}
                    </div>
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 h-full flex flex-col justify-between">
                <div className="text-secondary/60 leading-none font-light">
                  {userProfile
                    ? getDisplayName(userProfile).toUpperCase()
                    : 'GUEST'}
                </div>
                <div className="text-3xl font-semibold">For you</div>
              </div>
            </div>
          }
        >
          {forYouRooms.map((room) => (
            <RoomCard room={room} key={room.id} />
          ))}
        </Roll>
      </div>
    </>
  )
}

export default Page
