'use client'
import { useEffect, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useRecoilState, useRecoilValue } from 'recoil'
import { searchVideoQueryStore } from '@/stores/search'
import ReactionIcon from '@com/atoms/ReactionIcon'
import { ReactionType } from '@/models/Reaction'
import PlayerStateRepository from '@/services/firestore/PlayerStateRepository'
import { curSongReqStore } from '@/stores/player'
import useAccount from '@/lib/account/useAccount'
import {
  LoadingHeader,
  LoadingScreen,
} from '@/components/atoms/loading-skeleton'
import { useRoomInfo } from '@/lib/play-isling/usecases/room/useRoomInfo'
import useTrackingRoom from '@/lib/play-isling/usecases/useTrackingRoom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import { getAvatarString } from '@/lib/common/user'
import { getDisplayName } from '@/lib/account/models/profile'
import Link from 'next/link'
import { Button } from '@/components/atoms/button'
import { IoAdd } from 'react-icons/io5'
import { useResizeObserver } from '@/lib/common/useResizeObserver'
import { displayMinWidth } from '@/lib/common/html'
import { roomLayoutStore } from '@/stores/room'

const listReaction: ReactionType[] = [
  'haha',
  'heart',
  'sad',
  'surprise',
  'angry',
]

function Page({ params }: { params: Record<string, string> }) {
  const { isLoading: isLoadingAuth } = useAccount({ mustLogin: false })
  const searchQuery = useRecoilValue(searchVideoQueryStore)
  const curSongReq = useRecoilValue(curSongReqStore)
  const router = useRouter()
  const pathName = usePathname()

  const roomSlug = (params.id as string) || 'isling'
  const { room, audiences } = useRoomInfo(roomSlug, true)
  const { logUserActivity } = useTrackingRoom(room?.id)
  const query = useSearchParams()
  const mode = query.get('mode') || 'master'
  const [layout] = useRecoilState(roomLayoutStore)

  const { contentRect } = useResizeObserver('app')
  const isSmallDevice = contentRect && contentRect.width < displayMinWidth.lg

  const searchPageURL = `${pathName}/search${
    query.toString() ? `?${query.toString()}` : ''
  }`

  const searchPageMobileURL = `/m/${pathName}/search${
    query.toString() ? `?${query.toString()}` : ''
  }`

  const playerRepo = useMemo(
    () => new PlayerStateRepository(roomSlug),
    [roomSlug]
  )

  const handleReaction = (type: ReactionType) => () => {
    playerRepo.reaction(type)
    logUserActivity({
      eventName: 'reaction',
      data: { itemId: String(room?.id) },
    })
  }

  useEffect(() => {
    if (searchQuery !== '') {
      router.push(searchPageURL)
    }
  }, [searchQuery, router, searchPageURL])

  // TODO: the layout is ugly
  return (
    <>
      {isLoadingAuth && <LoadingHeader />}
      {isLoadingAuth && <LoadingScreen />}
      {contentRect && !isSmallDevice && (
        <>
          {layout !== 'fullScreen' && mode === 'silent' && (
            <div className="lg:px-6">
              <div className="h-12 lg:h-[4.5rem]" />
              <div className="grid grid-cols-3 gap-12 mb-10">
                <div
                  id="video-placeholder"
                  className="overflow-hidden lg:rounded-sm aspect-[3/2] lg:aspect-video lg:w-full"
                />
                <div className="col-span-2 text-secondary">
                  <div className="mt-3 text-xl text-secondary">
                    {curSongReq?.song.title}
                  </div>
                  <div className="flex space-x-4 items-center h-12">
                    {listReaction.map((type) => (
                      <div
                        key={type}
                        onClick={handleReaction(type as ReactionType)}
                        className="w-8 h-8 cursor-pointer hover:w-12 hover:h-12 transition-all duration-700 group"
                      >
                        <ReactionIcon
                          type={type as ReactionType}
                          className="group-active:scale-110 transition-all duration-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {layout !== 'fullScreen' && mode !== 'silent' && (
            <div className="lg:px-6">
              <div className="h-12 lg:h-[4.5rem]" />
              <div>
                <div
                  id="video-placeholder"
                  className="overflow-hidden lg:rounded-sm aspect-[3/2] lg:aspect-video lg:w-full"
                />
                <div className="grid grid-cols-[1fr_auto] gap-4 text-secondary">
                  <div className="mt-3 text-xl text-secondary">
                    {curSongReq?.song.title}
                  </div>
                  <div className="flex space-x-4 items-center h-12">
                    {listReaction.map((type) => (
                      <div
                        key={type}
                        onClick={handleReaction(type as ReactionType)}
                        className="w-8 h-8 cursor-pointer hover:w-12 hover:h-12 transition-all duration-700 group"
                      >
                        <ReactionIcon
                          type={type as ReactionType}
                          className="group-active:scale-110 transition-all duration-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {layout === 'fullScreen' && (
            <>
              <div className="w-[calc(100vh*16/9)] mx-auto">
                <div
                  id="video-placeholder"
                  className="overflow-hidden aspect-[3/2] lg:aspect-video lg:w-full"
                />
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4 text-secondary px-6">
                <div className="mt-3 text-xl text-secondary">
                  {curSongReq?.song.title}
                </div>
                <div className="flex space-x-4 items-center h-12">
                  {listReaction.map((type) => (
                    <div
                      key={type}
                      onClick={handleReaction(type as ReactionType)}
                      className="w-8 h-8 cursor-pointer hover:w-12 hover:h-12 transition-all duration-700 group"
                    >
                      <ReactionIcon
                        type={type as ReactionType}
                        className="group-active:scale-110 transition-all duration-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {audiences.length > 0 && (
            <div className="grid grid-cols-5 lg:grid-cols-8 gap-4 mt-8 lg:px-6">
              {audiences.map((user) => (
                <div key={user.id} className="flex flex-col items-center">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="text-xl">
                      {getAvatarString(getDisplayName(user))}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-2 text-xs font-semibold text-center">
                    {getDisplayName(user)}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="h-24" />
        </>
      )}
      {contentRect && isSmallDevice && (
        <div className="relative w-full h-full">
          <div className="h-12" />
          {mode === 'silent' && (
            <div className="grid grid-cols-[auto_1fr] px-2 gap-2 mt-4">
              <div id="video-placeholder" className="h-20 aspect-video z-0" />
              <div className="">
                <p className="font-light">{curSongReq?.song.title}</p>
              </div>
            </div>
          )}
          {mode !== 'silent' && (
            <div
              id="video-placeholder"
              className="w-full h-[calc(100vw/16*9)] z-0"
            />
          )}
          <div className="absolute bottom-0 w-full px-2 flex items-center justify-between h-12">
            <div className="flex items-center space-x-2 mt-2 z-50">
              {listReaction.map((type) => (
                <div
                  key={type}
                  onClick={handleReaction(type as ReactionType)}
                  className="w-8 h-8 cursor-pointer transition-all duration-700 group z-10"
                >
                  <ReactionIcon
                    type={type as ReactionType}
                    className="group-active:scale-110 transition-all duration-100"
                  />
                </div>
              ))}
            </div>
            <Link href={searchPageMobileURL}>
              <Button size="default" variant="highlight">
                <IoAdd className="mr-2" />
                Add Song
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default Page
