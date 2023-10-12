'use client'
import { IoHeart } from 'react-icons/io5'
import { getAvatarString } from '@/lib/common/user'
import Roll from '@com/organisms/Roll'
import HomeHeader from '@/components/templates/headers/HomeHeader'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import HomeHeaderForGuest from '@/components/templates/headers/HomeHeaderForGuest'
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

  return (
    <>
      {globalLoading && <LoadingHeader />}
      {globalLoading && <LoadingScreen />}
      <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
        {!userProfile ? (
          <HomeHeaderForGuest guestProfile={guestProfile} />
        ) : (
          <HomeHeader userProfile={userProfile} />
        )}
      </header>
      <div className="h-48" />
      {!homeData?.collections[0] && (
        <div className="flex flex-col items-center">
          <IoHeart className="text-4xl animate-pulse text-rose-400" />
          <div className="text-center text-xl mt-6">
            Party-Rooms will appear here
          </div>
        </div>
      )}
      {homeData?.collections[0] && (
        <div className="mx-40">
          <Roll
            title={
              <div className="flex pb-2">
                {!userProfile ? (
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={guestProfile?.avatarUrl} />
                    <AvatarFallback>
                      <div className="text-2xl">
                        {getAvatarString(displayName)}
                      </div>
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={userProfile.avatarUrl} />
                    <AvatarFallback>
                      <div className="text-2xl">
                        {getAvatarString(displayName)}
                      </div>
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="ml-4 h-full flex flex-col justify-between">
                  <div className="text-secondary/60 leading-none font-light">
                    {displayName.toUpperCase()}
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
      )}
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
