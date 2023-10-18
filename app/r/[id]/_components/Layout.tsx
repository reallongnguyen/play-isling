'use client'

import {
  isForceShowPlaylistStore,
  isShowQRStore,
  roomLayoutStore,
} from '@/stores/room'
import { useDrag } from '@use-gesture/react'
import { usePathname } from 'next/navigation'
import { QRCodeCanvas } from 'qrcode.react'
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { animated, useSpring } from 'react-spring'
import { useRecoilValue } from 'recoil'

export interface RoomLayoutProps extends PropsWithChildren<unknown> {
  playlist: ReactNode
  header: ReactNode
}

const webURL = process.env.NEXT_PUBLIC_WEBSITE_URL || ''

function PlayerLayout({ children, playlist, header }: RoomLayoutProps) {
  const layout = useRecoilValue(roomLayoutStore)
  const [shouldShowPanel, setShouldShowPanel] = useState(true)
  const path = usePathname()
  const isForceShowPlaylist = useRecoilValue(isForceShowPlaylistStore)

  // QR
  const isShowQR = useRecoilValue(isShowQRStore)
  const [{ top, left }, api] = useSpring(() => ({
    top: window.innerHeight / 2,
    left: window.innerWidth / 2,
  }))
  const bind = useDrag(({ xy: [x, y] }) => {
    api.set({ top: y, left: x })
  })
  const qrURL = useMemo(() => {
    const url = new URL(webURL + path)
    url.searchParams.set('mode', 'silent')

    return url.toString()
  }, [path])

  useEffect(() => {
    let id = setTimeout(() => {
      setShouldShowPanel(false)
    }, 3000)
    window.onmousemove = () => {
      setShouldShowPanel(true)
      if (id) {
        clearTimeout(id)
      }
      id = setTimeout(() => {
        setShouldShowPanel(false)
      }, 3000)
    }

    return () => {
      clearTimeout(id)
    }
  }, [])

  return (
    <div className="h-full">
      {isShowQR && (
        <animated.div
          className="fixed -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-50 touch-none"
          style={{
            top: top,
            left: left,
          }}
        >
          <QRCodeCanvas
            className="border-4 border-white rounded"
            size={window.innerHeight * 0.4}
            value={qrURL}
            {...bind()}
          />
          <div className="absolute top-full text-xl lg:text-2xl mt-4 text-center">
            Quét mã QR trên điện thoại<br></br>để thêm bài hát
          </div>
        </animated.div>
      )}
      <header
        className={`
          fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary
          transition-opacity duration-700 z-50
          ${
            layout === 'fullScreen' && shouldShowPanel
              ? 'opacity-95'
              : 'opacity-0'
          }
          ${layout !== 'fullScreen' ? 'opacity-100' : ''}
        `}
      >
        {header}
      </header>
      <div className="grid grid-rows-[auto_1fr] lg:relative">
        <div
          id="video-wrapper"
          className={`${
            layout === 'fullScreen'
              ? 'w-screen lg:w-auto z-10'
              : 'lg:w-[calc(100vw-27.5rem)]'
          } h-[calc(100vw/16*9+6rem)] lg:relative lg:bottom-auto lg:h-auto`}
        >
          {children}
        </div>
        <div
          className={`
            w-full h-[calc(100dvh-100vw/16*9-6rem)] lg:fixed lg:bottom-auto lg:top-[4.5rem]
            lg:right-6 overflow-hidden lg:rounded-xl lg:h-[calc(100dvh-6rem)] lg:w-[26rem]
            transition-opacity duration-700
            ${
              layout === 'fullScreen' &&
              (shouldShowPanel || isForceShowPlaylist)
                ? 'opacity-90'
                : 'opacity-0'
            }
            ${layout !== 'fullScreen' ? 'z-20 opacity-100' : 'z-50'}
        `}
        >
          {playlist}
        </div>
      </div>
    </div>
  )
}

export default PlayerLayout
