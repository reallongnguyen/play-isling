'use client'
import { IoHeart } from 'react-icons/io5'
import { getAvatarString } from '@/lib/common/user'
import Roll from '@com/organisms/Roll'
import HomeHeader from '@/components/templates/headers/HomeHeader'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import {
  LoadingHeader,
  LoadingScreen,
} from '@/components/atoms/loading-skeleton'
import { getDisplayName } from '@/lib/account/models/profile'
import RoomCard from '@/components/organisms/room/room-card'
import useHome from '@/lib/play-isling/usecases/home/useHome'
import useGuest from '@/lib/play-isling/usecases/useGuest'

function Page() {
  const { userProfile, isLoading, homeData } = useHome()
  const { guestProfile, isLoading: isGuestLoading } = useGuest()

  const globalLoading = isLoading || isGuestLoading
  const displayName = userProfile
    ? getDisplayName(userProfile)
    : guestProfile
    ? getDisplayName(guestProfile)
    : 'GUEST'
  const avatarUrl = userProfile?.avatarUrl || guestProfile?.avatarUrl

  return (
    <>
      {globalLoading && <LoadingHeader />}
      {globalLoading && <LoadingScreen />}
      <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
        <HomeHeader />
      </header>
      <div className="h-24 lg:h-48" />
      {!homeData?.collections[0] && (
        <div className="flex flex-col items-center z-10">
          <IoHeart className="text-4xl animate-pulse text-rose-400" />
          <div className="text-center text-xl mt-6">
            Party-Rooms will appear here
          </div>
        </div>
      )}
      {homeData?.collections[0] && (
        <div className="mx-4 lg:mx-16 xl:mx-40">
          <Roll
            title={
              <div className="flex pb-2">
                <Avatar className="w-12 h-12 lg:w-16 lg:h-16">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>
                    <div className="text-2xl">
                      {getAvatarString(displayName)}
                    </div>
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 h-full flex flex-col justify-between">
                  <div className="text-sm lg:text-base text-secondary/60 leading-none font-light">
                    {displayName.toUpperCase()}
                  </div>
                  <div className="text-xl lg:text-3xl font-semibold">
                    {homeData?.collections[0].name}
                  </div>
                </div>
              </div>
            }
          >
            {homeData?.collections[0].rooms.map((room) => (
              <RoomCard size="medium" room={room} key={room.id} />
            ))}
          </Roll>
        </div>
      )}
      {homeData?.collections.slice(1).map((collection) => (
        <div
          className="mx-4 mt-8 lg:mx-16 xl:mx-40 lg:mt-16"
          key={collection.id}
        >
          <Roll
            title={
              <div className="flex pb-2">
                <div className="text-xl lg:text-3xl font-semibold">
                  {collection.name}
                </div>
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
