'use client'
import { FC } from 'react'
import { getAvatarString } from '@/lib/common/user'
import Link from 'next/link'

import { UserDropdownContent } from './UserDropdownContent'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/atoms/avatar'
import { IslingLogo } from '@/components/atoms/logo'
import Profile, { getDisplayName } from '@/lib/account/models/profile'
import { usePathname } from 'next/navigation'
import MenuItem from './MenuItem'

export interface HeaderProps {
  page?: 'player' | 'search'
  userProfile: Profile
}

const HomeHeader: FC<HeaderProps> = ({ userProfile }) => {
  const pathName = usePathname()

  return (
    <>
      <div className="fixed z-[999] left-1/2 -translate-x-1/2 h-14 flex justify-center items-center text-secondary">
        <div className="w-[34rem] rounded-full flex justify-center items-center pr-2 space-x-12">
          <MenuItem name="Home" url="/" active={pathName === '/'} />
          <MenuItem name="Explore" url="/" active={pathName === '/explore'} />
          <MenuItem
            name="Your room"
            url="/me/rooms"
            active={pathName === '/me/rooms'}
          />
          <MenuItem name="Search" url="/" active={pathName === '/search'} />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto] h-full text-secondary">
        <div className="flex items-center h-full space-x-6">
          <Link href="/">
            <IslingLogo />
          </Link>
        </div>
        <div className="flex items-center h-full space-x-3 lg:space-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
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

export default HomeHeader
