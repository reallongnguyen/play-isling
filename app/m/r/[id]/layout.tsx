import type { Metadata } from 'next'
import { toRoomPublic } from '@/lib/play-isling/models/transform'
import { PropsWithChildren, ReactNode } from 'react'
import { notFound } from 'next/navigation'
import RoomHeaderWrapper from './_components/RoomHeaderWrapper'
import { getRoom } from '@/lib/play-isling/repo/api'

const websiteURL = process.env.NEXT_PUBLIC_WEBSITE_URL

export async function generateMetadata({
  params,
}: {
  params: Record<string, string>
}): Promise<Metadata> {
  try {
    const roomRes = await getRoom(params.id)()

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
    const roomRes = await getRoom(params.id)()
    const room = roomRes.data

    return (
      <div className="h-screen w-screen lg:h-auto relative bg-primary overflow-hidden">
        <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
          <RoomHeaderWrapper room={room} isShowRoom />
        </header>
        {children}
        <div className="invisible w-full h-2/3 rounded bottom-0 fixed lg:bottom-auto lg:top-[4.5rem] lg:right-6 overflow-hidden lg:rounded-xl lg:h-[calc(100vh-6rem)] lg:w-[26rem]">
          {playlist}
        </div>
      </div>
    )
  } catch (err) {
    notFound()
  }
}
