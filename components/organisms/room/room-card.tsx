import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import { Tooltip } from '@/components/atoms/tooltip'
import { getDisplayName } from '@/lib/account/models/profile'
import { getAvatarString } from '@/lib/common/user'
import { RoomPublic, getRoomURL } from '@/lib/play-isling/models/Room'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { HTMLProps, memo } from 'react'
import { IoRadio } from 'react-icons/io5'

export class RoomCardProps implements Omit<HTMLProps<HTMLDivElement>, 'size'> {
  room!: RoomPublic
  className?: string
  size?: 'large' | 'medium' | 'small'
  hideTitle? = false
}

const sizeMap = {
  large: 'w-96',
  medium: 'w-80',
  small: 'w-64',
}

function RoomCard({
  room,
  className,
  size,
  hideTitle,
  ...props
}: RoomCardProps) {
  const sizeClass = sizeMap[size || 'medium']

  return (
    <div
      className={cn(
        `
          active:scale-95 transition-all duration-100
          ${sizeClass}
        `,
        className
      )}
      {...props}
    >
      <Link href={getRoomURL(room)}>
        <div
          className={`relative aspect-video rounded ${sizeClass} overflow-hidden hover:brightness-75`}
        >
          <Image
            src={room.cover}
            alt={room.name}
            className="object-cover"
            fill
            unoptimized
          />
        </div>
      </Link>
      {!hideTitle && (
        <div className="flex space-x-3 mt-4 items-start">
          {room.owner && (
            <Tooltip content={getDisplayName(room.owner)}>
              <Avatar>
                <AvatarImage
                  src={room.owner.avatarUrl}
                  className="bg-primary-light"
                />
                <AvatarFallback>
                  {getAvatarString(getDisplayName(room.owner))}
                </AvatarFallback>
              </Avatar>
            </Tooltip>
          )}
          <div>
            <div className="text-xl">
              <Link href={getRoomURL(room)}>{room.name}</Link>
            </div>
            {room.description && (
              <div className="text-secondary/40 font-light mt-1">
                {room.description}
              </div>
            )}
            {room.audienceCount > 0 ? (
              <div className="top-full flex items-center h-5 bg-red-600 border-red-800 rounded-sm px-1 text-secondary/80 mt-1">
                <div className="flex items-center">
                  <IoRadio />
                  <p className="ml-1 text-sm">LIVE</p>
                </div>
                <p className="text-sm font-light">
                  <span className="border-secondary">｜</span>
                  {room.audienceCount == 1
                    ? `${room.audienceCount} person is watching`
                    : `${room.audienceCount} people are watching`}
                </p>
              </div>
            ) : (
              <div className="h-5"></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(RoomCard)
