'use client'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import ReactPlayer from 'react-player'
import { useSpring, animated } from '@react-spring/web'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import { playerEvent } from '@/models/eventEmitter/player'
import { curSongReqStore, isPlayingStore } from '@/stores/player'
import {
  emitAddReaction,
  emitClearReaction,
} from '@/services/emitter/reactionEmitter'
import PlayerStateRepository, {
  SnapshotReactionHandler,
} from '@/services/firestore/PlayerStateRepository'
import { playlistStore } from '@/stores/playlist'
import ReactionPool from '@com/templates/ReactionPool'
import Image from 'next/image'
import { useResizeObserver } from '@/lib/common/useResizeObserver'
import { displayMinWidth } from '@/lib/common/html'
import { isForceShowPlaylistStore, roomLayoutStore } from '@/stores/room'
import { OnProgressProps } from 'react-player/base'

const youtubeVideoBaseUrl = 'https://www.youtube.com/watch?v='
const initialPos = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  opacity: 0,
  zIndex: 0,
}

function VideoPlayer() {
  const pathName = usePathname()
  const params = useParams()
  const searchParam = useSearchParams()
  const player = useRef<ReactPlayer>(null)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingStore)
  const curSongReq = useRecoilValue(curSongReqStore)
  const resetCurSongReq = useResetRecoilState(curSongReqStore)
  const resetPlaylist = useResetRecoilState(playlistStore)
  const playerRef = useRef<HTMLDivElement>(null)
  const [playerProps, playerCtrl] = useSpring(() => ({ from: initialPos }), [])
  const roomId = params?.id ? (params?.id as string) : undefined
  const isLivingRoom = pathName === `/r/${params?.id}`
  const isLightMode = !!searchParam.get('lightMode')
  const mode = searchParam.get('mode') || 'master'
  const isMounted = useRef(true)
  const { contentRect } = useResizeObserver('app')
  const isSmallDevice = contentRect && contentRect.width < displayMinWidth.lg
  const roomLayout = useRecoilValue(roomLayoutStore)
  const setIsForceShowPlaylist = useSetRecoilState(isForceShowPlaylistStore)

  const playerRepo = useMemo(() => {
    if (typeof roomId === 'undefined') {
      return undefined
    }

    return new PlayerStateRepository(roomId)
  }, [roomId])

  const onReady = () => {
    // play video at 0s
    player.current?.seekTo(0)
  }

  const handleVideoEndOrError = (err?: Error) => {
    if (err) {
      console.error('VideoPlayer: video error:', err)
    }

    playerEvent.emit('ended')
  }

  const onPlay = () => {
    console.log('onPlay')
    setIsPlaying(true)
  }

  const onPause = () => {
    console.log('onPause')
    setIsPlaying(false)
  }

  const handleProgress = (state: OnProgressProps) => {
    if (
      state.playedSeconds / state.played - state.playedSeconds <= 10 ||
      state.playedSeconds <= 20
    ) {
      setIsForceShowPlaylist(true)
    } else {
      setIsForceShowPlaylist(false)
    }
  }

  const clonePositionAndClass = useCallback(
    (
      distRef: HTMLElement | null,
      srcEleId: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      springCtrl: any,
      baseClass = 'fixed overflow-hidden w-full',
      isUseAnimation?: boolean
    ) => {
      const srcEle = document.getElementById(srcEleId)

      if (!srcEle) {
        springCtrl.set(initialPos)
        return
      }

      if (!distRef) {
        return
      }

      const srcEleRect = srcEle.getBoundingClientRect()
      const distEleRect = distRef.getBoundingClientRect()
      const totalDiffPos =
        Math.abs(distEleRect.left - srcEleRect.left) +
        Math.abs(distEleRect.top - srcEleRect.top)

      const shouldUseAnimation =
        typeof isUseAnimation !== 'undefined'
          ? isUseAnimation
          : totalDiffPos > 200

      const srcEleClass = Array.from(srcEle.classList)
        .filter((className) => {
          return [
            /^((xs|sm|lg|xl|hover|active|focus):)*rounded[lrtb]{0,2}?-.*/,
            /^((xs|sm|lg|xl|hover|active|focus):)*p[lrtb]-.*/,
          ].find((reg) => reg.test(className))
        })
        .join(' ')

      distRef.className = `${baseClass} ${srcEleClass}`

      const newProps = {
        top: srcEleRect.top,
        left: srcEleRect.left,
        width: srcEleRect.width,
        height: srcEleRect.height,
        opacity: 1,
        zIndex: 40,
      }

      if (shouldUseAnimation) {
        springCtrl.start(newProps)
      } else {
        springCtrl.set(newProps)
      }
    },
    []
  )

  useEffect(() => {
    if (!playerRepo) {
      return
    }

    const reactionHandler: SnapshotReactionHandler = (id, type) => {
      emitAddReaction({ id, type })
    }

    const unsubReaction = playerRepo.onSnapshotReaction(reactionHandler)

    return () => {
      unsubReaction()
      emitClearReaction()
    }
  }, [playerRepo])

  useEffect(() => {
    isMounted.current = false
    let attempt = 300

    // set video player position
    const id = setInterval(() => {
      const videoPlaceholder = document.getElementById('video-placeholder')

      if (!videoPlaceholder) {
        if (attempt <= 0) {
          clearInterval(id)
        }

        attempt -= 1

        return
      }

      clearInterval(id)

      clonePositionAndClass(
        playerRef.current,
        'video-placeholder',
        playerCtrl,
        'fixed overflow-hidden w-full group',
        !isMounted.current
      )
    }, 50)

    if (isLivingRoom) {
      document.onscroll = () => {
        clonePositionAndClass(
          playerRef.current,
          'video-placeholder',
          playerCtrl,
          'fixed overflow-hidden w-full group',
          false
        )
      }
    }
  }, [clonePositionAndClass, playerCtrl, isLivingRoom, pathName])

  useEffect(() => {
    // set video player position
    const id = setInterval(() => {
      const videoPlaceholder = document.getElementById('video-placeholder')

      if (!videoPlaceholder) {
        return
      }

      clearInterval(id)

      clonePositionAndClass(
        playerRef.current,
        'video-placeholder',
        playerCtrl,
        'fixed overflow-hidden w-full group',
        true
      )
    }, 50)
  }, [clonePositionAndClass, mode, playerCtrl])

  const videoPlaceholderSizeChange: ResizeObserverCallback = useCallback(() => {
    clonePositionAndClass(
      playerRef.current,
      'video-placeholder',
      playerCtrl,
      'fixed overflow-hidden w-full group'
    )
  }, [clonePositionAndClass, playerCtrl])

  useEffect(() => {
    let attempt = 400
    const resizeObserver = new ResizeObserver(videoPlaceholderSizeChange)

    const id = setInterval(() => {
      const srcEle = document.getElementById('video-placeholder')
      const wrapperEle = document.getElementById('video-wrapper')

      if (!srcEle) {
        attempt -= 1
        if (attempt === 0) {
          console.info('resize observe video-wrapper: can not find element')
          clearInterval(id)
        }

        return
      }

      Object.values({
        srcEle,
        wrapperEle,
      }).forEach((ele) => {
        if (ele) {
          resizeObserver.observe(ele)
        }
      })

      clearInterval(id)
    }, 50)

    return () => {
      resizeObserver.disconnect()
    }
  }, [videoPlaceholderSizeChange, pathName])

  // clear data
  useEffect(() => {
    return () => {
      resetPlaylist()
      resetCurSongReq()
    }
  }, [resetCurSongReq, roomId, resetPlaylist])

  return (
    <div id="video-player">
      <ReactionPool elementRef={playerRef} />
      <animated.div ref={playerRef} style={playerProps}>
        {curSongReq && mode !== 'silent' && (
          <ReactPlayer
            style={{
              // set pointerEvents none to catch mouse movement on fullScreen mode
              pointerEvents: roomLayout === 'fullScreen' ? 'none' : 'auto',
              touchAction: roomLayout === 'fullScreen' ? 'none' : 'auto',
            }}
            ref={player}
            url={youtubeVideoBaseUrl + curSongReq.song.id}
            playing={isPlaying}
            controls={true}
            onReady={onReady}
            onPlay={onPlay}
            onPause={onPause}
            onEnded={handleVideoEndOrError}
            onError={handleVideoEndOrError}
            muted={isSmallDevice}
            width="100%"
            height="100%"
            light={isLightMode}
            onProgress={handleProgress}
          />
        )}
        {curSongReq && mode === 'silent' && (
          <div className="w-full h-full">
            <Image
              className="scale-[1.1]"
              src={curSongReq.song.thumbnail}
              alt={curSongReq.song.title}
              fill
            />
          </div>
        )}
      </animated.div>
    </div>
  )
}

export default VideoPlayer
