'use client'

import useAccount from '@/lib/account/useAccount'
import {
  LoadingHeader,
  LoadingScreen,
} from '@/components/atoms/loading-skeleton'
import SearchHeader from '@/components/templates/headers/SearchHeader'
import PageHeader from '@/components/organisms/page-header'
import useSWR from 'swr'
import { buildApiURL, fetcher } from '@/lib/common/repo/swr'
import { useRef } from 'react'
import { SearchResult } from '@/lib/play-isling/models/SearchResult'
import RoomCard from '@/components/organisms/room/room-card'
import Link from 'next/link'
import { getRoomURL } from '@/lib/play-isling/models/Room'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import { getDisplayName } from '@/lib/account/models/profile'
import { getAvatarString } from '@/lib/common/user'
import { toKMBString } from '@/lib/utils'
import { IoRadio } from 'react-icons/io5'
import { useSearchParams } from 'next/navigation'
import { toast } from '@/components/atoms/use-toast'

function Page() {
  const { isLoading: isLoadingAuth } = useAccount({ mustLogin: false })
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const queryRef = useRef(query)
  queryRef.current = query

  const { data } = useSWR<SearchResult>(
    buildApiURL(`/play-isling/v1/search?query=${query}&limit=16`),
    fetcher.get,
    {
      isPaused: () => queryRef.current === null,
      onError(err) {
        toast({ title: err.message })
      },
    }
  )

  return (
    <div className="relative bg-primary">
      {isLoadingAuth && <LoadingHeader />}
      {isLoadingAuth && <LoadingScreen />}
      <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
        <SearchHeader
          backBtn={{
            url: '/',
            title: 'Home',
          }}
        />
      </header>
      <div className="h-12" />
      <div className="container-md">
        {data && data.rooms?.edges.length === 0 && (
          <div className="fixed w-screen h-screen top-0 left-0 grid place-items-center">
            <div className="grid grid-cols-2">
              <div className="h-96 object-scale-down">
                <img
                  className="object-scale-down h-96"
                  src="/cat.png"
                  alt="isling"
                />
              </div>
              <div className="text-lg">
                We couldn&apos;t found any results 🙀
              </div>
            </div>
          </div>
        )}
        {data?.rooms && data?.rooms.edges.length > 0 && (
          <>
            <PageHeader pageName="Rooms" className="mb-4" />
            <div className="space-y-8">
              {data?.rooms.edges.map((room) => (
                <div className="flex space-x-4" key={room.id}>
                  <RoomCard room={room} size="small" hideTitle />
                  <div>
                    <Link href={getRoomURL(room)} className="text-xl">
                      {room.name}
                    </Link>
                    {room.owner && (
                      <div className="flex items-center space-x-2 my-4">
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            src={room.owner.avatarUrl}
                            className="bg-primary-light"
                          />
                          <AvatarFallback className="text-xs">
                            {getAvatarString(getDisplayName(room.owner))}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          {getDisplayName(room.owner)}
                        </div>
                      </div>
                    )}
                    {room.description && (
                      <p className="text-secondary/40 font-light mt-1">
                        {room.description}
                      </p>
                    )}
                    {room.audienceCount > 0 && (
                      <div className="top-full flex items-center h-5 bg-red-600 border-red-800 rounded-sm px-1 text-secondary/80 mt-1">
                        <div className="flex items-center">
                          <IoRadio />
                          <p className="ml-1 text-sm">LIVE</p>
                        </div>
                        <p className="text-sm font-light">
                          <span className="border-secondary">｜</span>
                          {room.audienceCount == 1
                            ? `${room.audienceCount} person is watching`
                            : `${toKMBString(
                                room.audienceCount
                              )} people are watching`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="h-24" />
    </div>
  )
}

export default Page
