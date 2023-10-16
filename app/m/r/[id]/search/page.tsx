'use client'
import {
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { newSongRequest } from '@/models/songRequest/SongRequest'
import { useRecoilState, useRecoilValue } from 'recoil'
import Song, { fromYoutubeVideo } from '@/models/song/Song'
import { playlistStore } from '@/stores/playlist'
import { pushSongRequest } from '@/models/songRequest/Playlist'
import PlaylistRepository from '@/services/firestore/PlaylistRepository'
import { getYoutubeVideos, searchYoutubeVideo } from '@/services/api/youtube'
import { YouTubeVideo } from '@/models/youtube/YoutubeVideo'
import { searchVideoQueryStore } from '@/stores/search'
import useAccount from '@/lib/account/useAccount'
import { newUser } from '@/models/user/User'
import { useRoomInfo } from '@/lib/play-isling/usecases/room/useRoomInfo'
import useTrackingRoom from '@/lib/play-isling/usecases/useTrackingRoom'
import useGuest from '@/lib/play-isling/usecases/useGuest'
import { getDisplayName } from '@/lib/account/models/profile'
import IconButton from '@/components/atoms/buttons/IconButton'
import { IoClose } from 'react-icons/io5'
import SongCardSearchResultMobile from '@/components/organisms/SongCardSearchResultMobile'

const youtubeVideoURLRegex =
  /^(?:(?:https:\/\/)?(?:www.)?youtube.com\/watch\?v=(.*?)(?=&|$).*)|(?:(?:https:\/\/)?(?:.*?)\/(.*?)(?=[?#]|$))/

const Page = ({ params }: { params: Record<string, string> }) => {
  const playlist = useRecoilValue(playlistStore)
  const { userProfile } = useAccount({ mustLogin: false })
  const { guestProfile } = useGuest()
  const [searchQuery, setSearchQuery] = useRecoilState(searchVideoQueryStore)
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([])

  const roomSlug = (params?.id as string) || 'isling'
  const { room } = useRoomInfo(roomSlug)
  const { logUserActivity } = useTrackingRoom(room?.id)

  const [keyword, setKeyword] = useState<string>(searchQuery)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeout = useRef<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const shouldFocusSearchInputOnMounted = useRef(true)

  const handleChangeKeyword = (value: string) => {
    setKeyword(value)

    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    timeout.current = setTimeout(function () {
      setSearchQuery(value)
      timeout.current = undefined
    }, 500)
  }

  const handleKeyPressOnSearch: KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === 'Enter') {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }

      setSearchQuery(keyword)
    }
  }

  const handleClearKeyword = () => {
    setKeyword('')
    searchInputRef.current?.focus()
  }

  useEffect(() => {
    if (searchQuery !== '' && shouldFocusSearchInputOnMounted.current) {
      searchInputRef.current?.focus()
      shouldFocusSearchInputOnMounted.current = false
    }
  }, [searchQuery])

  const playlistRepo = useMemo(
    () => new PlaylistRepository(roomSlug),
    [roomSlug]
  )

  const searchVideo = async (query: string) => {
    if (query === '') {
      return
    }

    const matchYtbUrl = query.match(youtubeVideoURLRegex)

    if (matchYtbUrl) {
      const videos = await getYoutubeVideos(matchYtbUrl[1] || matchYtbUrl[2])

      setYoutubeVideos(videos)

      return
    }

    // Search by name
    const results = await searchYoutubeVideo(query)
    const videos = await getYoutubeVideos(
      results.map((item) => item.id.videoId).join(',')
    )

    setYoutubeVideos(videos)
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }

  const addSongRequest = (youtubeSong: Song) => async () => {
    const profile = userProfile || guestProfile
    const displayName = profile ? getDisplayName(profile) : ''
    const userId = userProfile?.accountId || guestProfile?.guestId || ''

    const songRequest = newSongRequest(
      youtubeSong,
      newUser(String(userId), displayName)
    )
    const newPlaylist = pushSongRequest(playlist, songRequest)
    console.log(newPlaylist)
    await playlistRepo.setPlaylist(newPlaylist)
    logUserActivity({
      eventName: 'add-item',
      data: { itemId: String(room?.id) },
    })
  }

  useEffect(() => {
    searchVideo(searchQuery)
    setSearchQuery('')
  }, [searchQuery, setSearchQuery])

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  return (
    <>
      <div ref={scrollRef} className="h-[100dvh] w-screen overflow-y-auto">
        <div className="h-16" />
        <div id="video-placeholder" className="h-0 w-0"></div>
        <div className="space-y-4">
          {youtubeVideos.map((video) => (
            <div
              className="cursor-pointer px-4"
              key={video.id}
              onClick={addSongRequest(fromYoutubeVideo(video))}
            >
              <SongCardSearchResultMobile song={fromYoutubeVideo(video)} />
            </div>
          ))}
        </div>
        <div className="h-32" />
      </div>
      <div className="fixed bottom-0 w-full p-4 pb-8 backdrop-blur-xl z-50">
        <div className="w-full rounded-full border border-gray-400 flex items-center pr-2">
          <input
            ref={searchInputRef}
            value={keyword}
            placeholder="Search or paste Youtube URL"
            className="w-full pl-4 py-2 outline-none bg-transparent font-light"
            onChange={({ target: { value } }) => handleChangeKeyword(value)}
            onKeyPress={handleKeyPressOnSearch}
          />
          {keyword.length > 0 && (
            <IconButton onClick={handleClearKeyword}>
              <IoClose className="text-secondary/50 hover:text-secondary text-lg" />
            </IconButton>
          )}
        </div>
      </div>
    </>
  )
}

export default Page
