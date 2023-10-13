'use client'
import { FC, KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { IoChevronBack, IoClose } from 'react-icons/io5'
import { getAvatarString } from '@/lib/common/user'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'

import IconButton from '../../atoms/buttons/IconButton'
import {
  GuestDropdownContent,
  UserDropdownContent,
} from './UserDropdownContent'
import { getDisplayName } from '@/lib/account/models/profile'
import useAccount from '@/lib/account/useAccount'
import useGuest from '@/lib/play-isling/usecases/useGuest'
import { useRouter, useSearchParams } from 'next/navigation'

export interface RoomHeaderProps {
  backBtn?: {
    url: string
    title: string
  }
}

const SearchHeader: FC<RoomHeaderProps> = ({ backBtn }) => {
  const [keyword, setKeyword] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeout = useRef<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { userProfile } = useAccount({ mustLogin: false })
  const { guestProfile } = useGuest()
  const searchParams = useSearchParams()
  const router = useRouter()

  const setSearchQuery = (q: string) => {
    if (q === '') {
      router.push('/search')

      return
    }

    router.push('/search?q=' + q)
  }

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
    setSearchQuery('')
    searchInputRef.current?.focus()
  }

  useEffect(() => {
    const q = searchParams.get('q')

    if (q !== null) {
      if (q === '') {
        router.replace('/')
      }

      setKeyword(q)
    } else {
      searchInputRef.current?.focus()
    }
  }, [router, searchParams])

  return (
    <>
      <div className="fixed z-[999] left-1/2 -translate-x-1/2 h-14 flex justify-center items-center text-secondary">
        <div className="w-[34rem] rounded-full border border-primary-light flex items-center pr-2">
          <input
            ref={searchInputRef}
            value={keyword}
            placeholder="Search rooms by name, owner's name"
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
      <div className="grid grid-cols-[1fr_auto] h-full text-secondary">
        <div className="max-w-[192px] flex items-center h-full space-x-8">
          {backBtn && (
            <Link href={backBtn.url} className="cursor-pointer">
              <div className="flex items-center space-x-0 group text-blue-300">
                <IoChevronBack className="text-2xl group-hover:brightness-75 group-active:scale-95" />
                <div className="truncate text-ellipsis font-light group-hover:brightness-75 text-sm hidden xl:block">
                  {backBtn.title}
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className="flex items-center h-full space-x-3 lg:space-x-6">
          {userProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={userProfile.avatarUrl} />
                  <AvatarFallback>
                    <div className="text-sm">
                      {getAvatarString(getDisplayName(userProfile))}
                    </div>
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <UserDropdownContent />
            </DropdownMenu>
          )}
          {guestProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={guestProfile.avatarUrl} />
                  <AvatarFallback>
                    <div className="text-sm">
                      {getAvatarString(getDisplayName(guestProfile))}
                    </div>
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <GuestDropdownContent />
            </DropdownMenu>
          )}
        </div>
      </div>
    </>
  )
}

export default SearchHeader
