import type { Metadata } from 'next'
import { toRoomPublic } from '@/lib/play-isling/models/transform'
import { PropsWithChildren, ReactNode } from 'react'
import { notFound } from 'next/navigation'
import RoomHeaderWrapper from './_components/RoomHeaderWrapper'
import { getRoom } from '@/lib/play-isling/repo/api'
import PlayerLayout from './_components/Layout'

const websiteURL = process.env.NEXT_PUBLIC_WEBSITE_URL

export async function generateMetadata({
  params,
}: {
  params: Record<string, string>
  playlist: ReactNode
}): Promise<Metadata> {
  try {
    const roomRes = await getRoom(params.id)()

    console.log('###', roomRes)

    const roomPublic = toRoomPublic(roomRes.data)
    const roomURL = `${websiteURL}${`/r/${roomPublic.id}`}`
    const roomTitle = `${roomPublic.name} — isling`

    return {
      title: roomTitle,
      description: roomPublic.description,
      icons: '/favicon.ico',
      openGraph: {
        siteName: 'Isling',
        url: roomURL,
        type: 'music.playlist',
        title: roomTitle,
        description: roomPublic.description,
        images: [
          {
            url: roomPublic.cover,
          },
        ],
      },
      robots: 'index, follow',
    }
  } catch (err) {
    return {}
  }
}

export default async function RoomLayout(
  props: PropsWithChildren<{
    params: Record<string, string>
    playlist: ReactNode
  }>
) {
  const { children, params, playlist } = props

  try {
    console.log('###', params.id)
    const roomRes = await getRoom(params.id)()

    console.log('###', roomRes)

    const room = roomRes.data

    return (
      <div className="h-[100dvh] lg:h-auto relative bg-primary">
        <PlayerLayout
          playlist={playlist}
          header={<RoomHeaderWrapper room={room} isShowRoom />}
        >
          {children}
        </PlayerLayout>
      </div>
    )
  } catch (err) {
    notFound()
  }
}
