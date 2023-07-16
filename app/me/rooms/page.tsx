'use client'
import { Button } from '@/components/atoms/button'
import IconButton from '@/components/atoms/buttons/IconButton'
import {
  LoadingHeader,
  LoadingScreen,
} from '@/components/atoms/loading-skeleton'
import { Tooltip } from '@/components/atoms/tooltip'
import PageHeader from '@/components/organisms/page-header'
import RoomCard from '@/components/organisms/room/room-card'
import HomeHeader from '@/components/templates/headers/HomeHeader'
import { getRoomURL, isEditable } from '@/lib/play-isling/models/Room'
import useMyRooms from '@/lib/play-isling/usecases/room/useMyRooms'
import Link from 'next/link'
import {
  IoAddOutline,
  IoPencilOutline,
  IoShareSocialOutline,
  IoTrashOutline,
} from 'react-icons/io5'

export default function MyRoomsPage() {
  const { userProfile, myRooms, getShareableLinkHandler, isLoading } =
    useMyRooms()

  if (!userProfile) {
    return (
      <>
        <LoadingHeader />
        <LoadingScreen />
      </>
    )
  }

  return (
    <>
      <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
        <HomeHeader userProfile={userProfile} />
      </header>
      {isLoading && <LoadingScreen />}
      <div className="h-12" />
      <div className="container-lg">
        <PageHeader
          className="mb-4"
          pageName="Your Rooms"
          rightChildren={
            <Link href="/me/rooms/add">
              <Button variant="highlight">
                <IoAddOutline className="mr-1 text-xl" />
                Create Room
              </Button>
            </Link>
          }
        />
        <div className="space-y-8">
          {myRooms?.map((room) => (
            <div className="flex" key={room.id}>
              <RoomCard room={room} size="small" hideTitle />
              <div className="ml-4">
                <Link href={getRoomURL(room)} className="text-xl">
                  {room.name}
                </Link>
                {room.description && (
                  <p className="text-secondary/40 font-light mt-1">
                    {room.description}
                  </p>
                )}
                <div className="flex space-x-2 mt-2">
                  <Tooltip content="Get shareable link" side="bottom">
                    <IconButton
                      className="hover:bg-primary-light/40 active:bg-primary-light/70"
                      onClick={getShareableLinkHandler(room)}
                    >
                      <IoShareSocialOutline />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Edit room" side="bottom">
                    <IconButton
                      className="hover:bg-primary-light/40 active:bg-primary-light/70"
                      disabled={!isEditable(room, userProfile)}
                    >
                      <IoPencilOutline />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Delete room" side="bottom">
                    <IconButton
                      className="hover:bg-primary-light/40 active:bg-primary-light/70"
                      disabled={!isEditable(room, userProfile)}
                    >
                      <IoTrashOutline />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-28" />
    </>
  )
}
