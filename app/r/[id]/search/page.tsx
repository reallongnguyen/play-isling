'use client'
import { useEffect, useMemo, useState } from 'react'

import { newSongRequest } from '@/models/songRequest/SongRequest'
import { useRecoilState, useRecoilValue } from 'recoil'
import Song, { fromYoutubeVideo } from '@/models/song/Song'
import SongCardSimple from '@/components/organisms/song-card/SongCardSimple'
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

  return (
    <div className="pl-6 pr-6 overflow-auto">
      <div className="lg:h-[4.5rem]" />
      <div className="space-y-4">
        {youtubeVideos.map((video) => (
          <div
            className="cursor-pointer"
            key={video.id}
            onClick={addSongRequest(fromYoutubeVideo(video))}
          >
            <SongCardSimple song={fromYoutubeVideo(video)} />
          </div>
        ))}
      </div>
      <div className="lg:h-20" />
    </div>
  )
}

export default Page
