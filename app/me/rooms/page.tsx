'use client'
import { Button } from '@/components/atoms/button'
import IconButton from '@/components/atoms/buttons/IconButton'
import {
  LoadingHeader,
  LoadingScreen,
} from '@/components/atoms/loading-skeleton'
import { Confirmation } from '@/components/atoms/popover'
import { Tooltip } from '@/components/atoms/tooltip'
import PageHeader from '@/components/organisms/page-header'
import RoomCard from '@/components/organisms/room/room-card'
import { DefaultLayout } from '@/components/templates/layouts/default'
import { getRoomURL, isEditable } from '@/lib/play-isling/models/Room'
import useMyRooms from '@/lib/play-isling/usecases/room/useMyRooms'
import Link from 'next/link'
import {
  IoAddOutline,
  IoInformationCircleOutline,
  IoPencilOutline,
  IoShareSocialOutline,
  IoTrashOutline,
} from 'react-icons/io5'

export default function MyRoomsPage() {
  const {
    userProfile,
    myRooms,
    getShareableLinkHandler,
    isLoading,
    deleteRoom,
    isDeleting,
  } = useMyRooms()

  const isNotCreatable = myRooms && myRooms.length >= 8

  if (!userProfile) {
    return (
      <>
        <LoadingHeader />
        <LoadingScreen />
      </>
    )
  }

  return (
    <DefaultLayout userProfile={userProfile} isLoading={isLoading}>
      <PageHeader
        className="mb-4"
        pageName="Your Rooms"
        rightChildren={
          <div className="flex space-x-1 items-center">
            <Link href={isNotCreatable ? '' : '/me/rooms/add'}>
              <Button variant="highlight" disabled={isNotCreatable}>
                <IoAddOutline className="mr-1 text-lg" />
                Create Room
              </Button>
            </Link>
            {isNotCreatable && (
              <Tooltip content="You fulfill the free-tier quota">
                <IoInformationCircleOutline className="text-lg text-secondary/60" />
              </Tooltip>
            )}
          </div>
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
                <Tooltip
                  content="Edit room feature is coming soon"
                  side="bottom"
                >
                  <IconButton
                    className="hover:bg-primary-light/40 active:bg-primary-light/70"
                    disabled={!isEditable(room, userProfile)}
                  >
                    <IoPencilOutline />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Delete room" side="bottom">
                  <Confirmation
                    title="Do you want this room deleted?"
                    onYes={() => deleteRoom(room.id)}
                    disabled={!isEditable(room, userProfile) || isDeleting}
                  >
                    <IconButton
                      className="hover:bg-primary-light/40 active:bg-primary-light/70"
                      disabled={!isEditable(room, userProfile) || isDeleting}
                    >
                      <IoTrashOutline />
                    </IconButton>
                  </Confirmation>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DefaultLayout>
  )
}
