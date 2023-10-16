'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from './skeleton'
import { IslingLogo } from './logo'
import { Avatar, AvatarFallback } from './avatar'
import Link from 'next/link'

export function LoadingSkeleton() {
  const [items, setItems] = useState<number[]>([1, 2, 3, 4])

  useEffect(() => {
    let i = 2
    let intervalId: NodeJS.Timer

    setItems([1])

    // eslint-disable-next-line prefer-const
    intervalId = setInterval(() => {
      setItems((val) => [...val, i])

      if (i === 4) {
        clearInterval(intervalId)
      }

      i += 1
    }, 250)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="w-full overflow-x-hidden flex space-x-3 lg:space-x-5 xl:space-x-6 scrollbar-hide z-[1000]">
      {items.map((id) => (
        <div key={id} className="w-32 lg:w-80">
          <Skeleton className="w-32 lg:w-80 aspect-[1/1.3] lg:aspect-video bg-primary-light rounded" />
        </div>
      ))}
    </div>
  )
}

export function LoadingHeader() {
  return (
    <div className="fixed top-0 w-screen h-14 flex justify-between items-center z-50 bg-primary px-2 lg:px-6">
      <Link href="/">
        <IslingLogo />
      </Link>
      <Avatar>
        <AvatarFallback></AvatarFallback>
      </Avatar>
    </div>
  )
}

export function LoadingScreen() {
  return (
    <>
      <div className="fixed top-12 lg:top-14 w-screen h-screen z-40 bg-primary">
        <div className="mt-[9rem] mx-4 lg:mx-16 xl:mx-40">
          <LoadingSkeleton />
        </div>
      </div>
    </>
  )
}
