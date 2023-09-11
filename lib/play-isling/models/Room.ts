import { AccountId } from '@/lib/account/models/account'
import Profile from '@/lib/account/models/profile'

export type VisibilityType = 'public' | 'member'

export interface Room {
  id: number
  ownerId: AccountId
  visibility: VisibilityType
  inviteCode?: string
  name: string
  slug: string
  description?: string
  cover: string
  audienceCount: number
  audiences: number[]
}

export type RoomPublic = Pick<
  Room,
  | 'id'
  | 'name'
  | 'slug'
  | 'cover'
  | 'description'
  | 'visibility'
  | 'audienceCount'
  | 'audiences'
>

export const getRoomURL = (room: Room | RoomPublic) => `/r/${room.slug}`

export const isEditable = (room: Room, profile: Profile) =>
  room.ownerId === profile.accountId
