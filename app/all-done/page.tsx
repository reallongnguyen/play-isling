'use client'

import { Button } from '@/components/atoms/button'
import HomeHeader from '@/components/templates/headers/HomeHeader'
import HomeHeaderForGuest from '@/components/templates/headers/HomeHeaderForGuest'
import useAccount from '@/lib/account/useAccount'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function Page() {
  const { userProfile } = useAccount({ mustLogin: false })
  const query = useSearchParams()
  const nextStep = query.get('next') || '/'

  return (
    <>
      <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
        {!userProfile ? (
          <HomeHeaderForGuest />
        ) : (
          <HomeHeader userProfile={userProfile} />
        )}
      </header>
      <div className="h-32" />
      <div className="grid grid-cols-2 place-items-center mx-96">
        <div className="object-center">
          <img src="/cat.png" alt="meow" className="object-scale-down" />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-6xl mt-8">Thanks!</p>
          <p className="text-xl mt-4">You&apos;re all done</p>
          <Link href={nextStep}>
            <Button className="mt-8 min-w-[6rem]" variant="outline">
              OK
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Page
