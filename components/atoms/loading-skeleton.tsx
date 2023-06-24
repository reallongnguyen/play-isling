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
    <div className="w-full overflow-x-hidden flex space-x-6 scrollbar-hide">
      {items.map((id) => (
        <div key={id} className="w-80">
          <Skeleton className="w-80 aspect-[16/9] bg-primary-light rounded" />
        </div>
      ))}
    </div>
  )
}

export function LoadingHeader() {
  return (
    <div className="fixed w-screen h-14 flex justify-between items-center z-50 bg-primary px-6">
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
      <div className="fixed top-14 w-screen h-screen z-40 bg-primary">
        <div className="mt-[9rem] mx-32">
          <LoadingSkeleton />
        </div>
      </div>
    </>
  )
}
