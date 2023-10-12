'use client'
import {
  LifeBuoy,
  Share2,
  LogOut,
  Plus,
  Settings,
  User,
  UserPlus,
  Users,
  LogIn,
} from 'lucide-react'

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
} from '@/components/atoms/dropdown-menu'
import useAccount from '@/lib/account/useAccount'
import Link from 'next/link'
import { getDisplayName } from '@/lib/account/models/profile'
import useGuest from '@/lib/play-isling/usecases/useGuest'

export function UserDropdownContent() {
  const { userProfile } = useAccount({ mustLogin: false })

  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel className="truncate">
        {userProfile ? getDisplayName(userProfile) : ''}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <Link href="/me/profile/edit">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer" disabled>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
          {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem className="cursor-pointer" disabled>
          <Users className="mr-2 h-4 w-4" />
          <span>Team</span>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuItem className="cursor-pointer" disabled>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Invite users</span>
          </DropdownMenuItem>
        </DropdownMenuSub>
        <DropdownMenuItem className="cursor-pointer" disabled>
          <Plus className="mr-2 h-4 w-4" />
          <span>New Team</span>
          {/* <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer" disabled>
        <Share2 className="mr-2 h-4 w-4" />
        <span>Get invite code</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer" disabled>
        <LifeBuoy className="mr-2 h-4 w-4" />
        <span>Support</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <Link href="/signout">
        <DropdownMenuItem className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </Link>
    </DropdownMenuContent>
  )
}

export function GuestDropdownContent() {
  const { guestProfile } = useGuest()

  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel className="truncate">
        {guestProfile ? '[Guest] ' + getDisplayName(guestProfile) : 'Guest'}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <Link href="/signup">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Sign up</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/signin">
          <DropdownMenuItem className="cursor-pointer">
            <LogIn className="mr-2 h-4 w-4" />
            <span>Sign in</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer" disabled>
        <LifeBuoy className="mr-2 h-4 w-4" />
        <span>Support</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
