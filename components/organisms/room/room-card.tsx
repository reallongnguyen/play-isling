import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import { Tooltip } from '@/components/atoms/tooltip'
import { getDisplayName } from '@/lib/account/models/profile'
import { getAvatarString } from '@/lib/common/user'
import { RoomPublic, getRoomURL } from '@/lib/play-isling/models/Room'
import { cn, toKMBString } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { HTMLProps, memo } from 'react'
import { IoPersonOutline, IoRadio } from 'react-icons/io5'

export class RoomCardProps implements Omit<HTMLProps<HTMLDivElement>, 'size'> {
  room!: RoomPublic
  className?: string
  size?: 'large' | 'medium' | 'small'
  hideTitle? = false
}

const sizeMap = {
  large: 'w-40 lg:w-96',
  medium: 'w-32 lg:w-80',
  small: 'w-24 lg:w-64',
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
          className={`relative aspect-[1/1.3] lg:aspect-video rounded ${sizeClass} overflow-hidden hover:brightness-75`}
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
        <div className="flex space-x-2 lg:space-x-3 mt-2 lg:mt-4 items-start">
          {room.owner && (
            <Tooltip content={getDisplayName(room.owner)}>
              <Avatar className="w-5 h-5 lg:w-8 lg:h-8">
                <AvatarImage src={room.owner.avatarUrl} />
                <AvatarFallback>
                  {getAvatarString(getDisplayName(room.owner))}
                </AvatarFallback>
              </Avatar>
            </Tooltip>
          )}
          <div>
            <div className="text-sm lg:text-lg">
              <Link href={getRoomURL(room)}>{room.name}</Link>
            </div>
            {room.description && (
              <div className="hidden lg:block text-secondary/40 font-light mt-1">
                {room.description}
              </div>
            )}
            {room.audienceCount > 0 ? (
              <div className=" flex items-center h-5 text-xs lg:text-sm bg-red-600 border-red-800 rounded-sm px-1 text-secondary/80 mt-1">
                <div className="flex items-center">
                  <IoRadio />
                  <p className="ml-1">LIVE</p>
                </div>
                <p className="border-secondary">｜</p>
                <div className="hidden lg:block font-light">
                  {room.audienceCount == 1
                    ? `${room.audienceCount} person is watching`
                    : `${toKMBString(room.audienceCount)} people are watching`}
                </div>
                <div className="lg:hidden flex items-center font-light">
                  <IoPersonOutline className="mr-1 text-xs lg:text-sm" />
                  {room.audienceCount}
                </div>
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
