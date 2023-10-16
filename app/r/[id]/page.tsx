'use client'
import { useEffect, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useRecoilValue } from 'recoil'
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

  return (
    <>
      {isLoadingAuth && <LoadingHeader />}
      {isLoadingAuth && <LoadingScreen />}
      {contentRect && !isSmallDevice && (
        <div className="block lg:pl-6 lg:pr-[29rem]">
          <div className="h-12 lg:h-[4.5rem]" />
          <div
            className={`${
              mode === 'silent' ? 'grid grid-cols-3 gap-12 mb-10' : ''
            }`}
          >
            <div
              id="video-placeholder"
              className="overflow-hidden lg:rounded-sm aspect-[3/2] lg:aspect-video lg:w-full"
            />
            <div
              className={`
              ${
                mode === 'silent'
                  ? 'col-span-2'
                  : 'grid grid-cols-[1fr_auto] gap-4'
              }
              text-secondary
            `}
            >
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
          {audiences.length > 0 && (
            <div className="grid grid-cols-5 lg:grid-cols-8 gap-4 mt-8">
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
        </div>
      )}
      {contentRect && isSmallDevice && (
        <div className="relative px-2 w-full h-full flex flex-col justify-end">
          <div
            id="video-placeholder"
            className="fixed bottom-[calc(100vh-100vw/16*9-2rem)] left-0 w-full h-[calc(100vw/16*9)] z-0"
          />
          <div className="flex items-center justify-between h-16">
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
