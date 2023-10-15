'use client'
import { FC, KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import {
  IoChevronBack,
  IoClose,
  IoVolumeHigh,
  IoVolumeMute,
} from 'react-icons/io5'
import { getAvatarString } from '@/lib/common/user'
import Link from 'next/link'
import { useRecoilState } from 'recoil'
import { searchVideoQueryStore } from '@/stores/search'
import { Room } from '@/lib/play-isling/models/Room'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'

import IconButton from '../../atoms/buttons/IconButton'
import { UserDropdownContent } from './UserDropdownContent'
import Profile, { getDisplayName } from '@/lib/account/models/profile'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/atoms/button'

export interface RoomHeaderProps {
  room?: Room
  backBtn?: {
    url: string
    title: string
  }
  isShowRoom?: boolean
  userProfile: Profile
}

const RoomHeader: FC<RoomHeaderProps> = ({
  room,
  backBtn,
  isShowRoom,
  userProfile,
}) => {
  const [searchQuery, setSearchQuery] = useRecoilState(searchVideoQueryStore)
  const [keyword, setKeyword] = useState<string>(searchQuery)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeout = useRef<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const shouldFocusSearchInputOnMounted = useRef(true)
  const searchParam = useSearchParams()
  const router = useRouter()
  const path = usePathname()
  const mode = searchParam.get('mode') || 'master'

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

  const changeRoomMode = () => {
    const newMode = mode !== 'silent' ? 'silent' : 'master'
    let queries = searchParam.toString()
    queries = queries.replace(/&?mode=\w+(?=&|$)/, '')

    if (newMode !== 'master') {
      if (queries != '') {
        queries += '&'
      }

      queries += `mode=${newMode}`
    }

    router.replace(`${path}?${queries}`)
  }

  useEffect(() => {
    if (searchQuery !== '' && shouldFocusSearchInputOnMounted.current) {
      searchInputRef.current?.focus()
      shouldFocusSearchInputOnMounted.current = false
    }
  }, [searchQuery])

  return (
    <>
      <div className="hidden lg:flex fixed z-[999] left-1/2 -translate-x-1/2 h-14 justify-center items-center text-secondary">
        <div className="w-[34rem] rounded-full border border-primary-light flex items-center pr-2">
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
      <div className="grid grid-cols-[1fr_auto] h-full text-secondary">
        <div className="max-w-[192px] flex items-center h-full space-x-8">
          {backBtn && (
            <Link href={backBtn.url} className="cursor-pointer">
              <div className="flex items-center space-x-0 group text-blue-300 h-full min-w-[2rem]">
                <IoChevronBack className="text-2xl group-hover:brightness-75 group-active:scale-95" />
                <div className="truncate text-ellipsis font-light group-hover:brightness-75 text-sm hidden xl:block">
                  {backBtn.title}
                </div>
              </div>
            </Link>
          )}
          {isShowRoom && (
            <Button
              variant="default"
              className={`
                h-8
                ${mode === 'silent' ? 'bg-orange-900' : 'bg-sky-900'}
              `}
              onClick={changeRoomMode}
            >
              <div className="flex items-center">
                {mode === 'silent' ? (
                  <IoVolumeMute className="text-lg text-secondary/80 mr-2" />
                ) : (
                  <IoVolumeHigh className="text-lg text-secondary/80 mr-2" />
                )}
                <div className="max-w-[80px] lg:max-w-[130px] truncate">
                  {room?.name}
                </div>
              </div>
            </Button>
          )}
        </div>
        <div className="flex items-center h-full space-x-3 lg:space-x-6">
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
        </div>
      </div>
    </>
  )
}

export default RoomHeader
