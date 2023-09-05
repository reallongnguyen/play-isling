'use client'
import { IoPersonOutline } from 'react-icons/io5'
import { getAvatarString } from '@/lib/common/user'
import Roll from '@com/organisms/Roll'
import HomeHeader from '@/components/templates/headers/HomeHeader'
import { Avatar, AvatarFallback } from '@/components/atoms/avatar'
import HomeHeaderForGuest from '@/components/templates/headers/HomeHeaderForGuest'
import {
  LoadingHeader,
  LoadingScreen,
} from '@/components/atoms/loading-skeleton'
import { getDisplayName } from '@/lib/account/models/profile'
import RoomCard from '@/components/organisms/room/room-card'
import useHome from '@/lib/play-isling/usecases/home/useHome'

function Page() {
  const { userProfile, isLoading, homeData } = useHome()

  return (
    <>
      {isLoading && <LoadingHeader />}
      {isLoading && <LoadingScreen />}
      <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
        {!userProfile ? (
          <HomeHeaderForGuest />
        ) : (
          <HomeHeader userProfile={userProfile} />
        )}
      </header>
      <div className="h-48" />
      <div className="mx-40">
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
                <div className="text-3xl font-semibold">
                  {homeData?.collections[0].name}
                </div>
              </div>
            </div>
          }
        >
          {homeData?.collections[0].rooms.map((room) => (
            <RoomCard room={room} key={room.id} />
          ))}
        </Roll>
      </div>
      {homeData?.collections.slice(1).map((collection) => (
        <div className="mx-40 mt-24" key={collection.id}>
          <Roll
            title={
              <div className="flex pb-2">
                <div className="text-3xl font-semibold">{collection.name}</div>
              </div>
            }
          >
            {collection.rooms.map((room) => (
              <RoomCard room={room} key={room.id} />
            ))}
          </Roll>
        </div>
      ))}
      <div className="h-24" />
    </>
  )
}

export default Page
