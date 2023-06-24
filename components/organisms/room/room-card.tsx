import { Room, getRoomURL } from '@/lib/play-isling/models/Room'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { HTMLProps, memo } from 'react'

export class RoomCardProps implements Omit<HTMLProps<HTMLDivElement>, 'size'> {
  room!: Room
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
        <>
          <div className="mt-4">
            <Link href={getRoomURL(room)}>{room.name}</Link>
          </div>
          {room.description && (
            <div className="text-secondary/40 font-light mt-2">
              {room.description}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default memo(RoomCard)
