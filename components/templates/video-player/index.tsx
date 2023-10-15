'use client'

import { usePathname } from 'next/navigation'
import { lazy } from 'react'

const VideoPlayer = lazy(() => import('./VideoPlayer'))

export default function VideoPlayerLazy() {
  const pathName = usePathname()
  const shouldShowPlayer =
    pathName?.startsWith('/r/') || pathName?.startsWith('/m/r/')

  return !shouldShowPlayer ? <></> : <VideoPlayer />
}
