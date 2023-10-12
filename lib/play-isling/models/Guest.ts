import Profile from '@/lib/account/models/profile'

export interface Guest extends Profile {
  guestId: string
  id: string
  isGuest: boolean
  version: number
}
