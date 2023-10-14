'use client'
import { FC } from 'react'
import { getAvatarString } from '@/lib/common/user'
import Link from 'next/link'

import { UserDropdownContent } from './UserDropdownContent'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import { IslingLogo } from '@/components/atoms/logo'
import { getDisplayName } from '@/lib/account/models/profile'
import { usePathname } from 'next/navigation'
import MenuItem from './MenuItem'
import useAccount from '@/lib/account/useAccount'
import useGuest from '@/lib/play-isling/usecases/useGuest'

const userMenuItems = [
  { name: 'Home', path: '/' },
  { name: 'Explore', path: '/explore' },
  { name: 'Your room', path: '/me/rooms' },
  { name: 'Search', path: '/search' },
]

const guestMenuItems = [
  { name: 'Home', path: '/' },
  { name: 'Explore', path: '/explore' },
  { name: 'Create account', path: '/signup' },
  { name: 'Search', path: '/search' },
]

const HomeHeader: FC = () => {
  const pathName = usePathname()
  const { userProfile } = useAccount({ mustLogin: false })
  const { guestProfile } = useGuest()

  const avatarUrl = userProfile?.avatarUrl || guestProfile?.avatarUrl
  const userFullName = userProfile
    ? getDisplayName(userProfile)
    : guestProfile
    ? getDisplayName(guestProfile)
    : 'Guest'
  const menuItems = userProfile ? userMenuItems : guestMenuItems

  return (
    <>
      <div className="fixed z-[999] left-1/2 -translate-x-1/2 h-14 flex justify-center items-center text-secondary">
        <div className="w-[34rem] rounded-full flex justify-center items-center pr-2 space-x-12">
          {menuItems.map((item) => (
            <MenuItem
              key={item.name}
              name={item.name}
              url={item.path}
              active={pathName === item.path}
            />
          ))}
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
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                  <div className="text-sm">{getAvatarString(userFullName)}</div>
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
