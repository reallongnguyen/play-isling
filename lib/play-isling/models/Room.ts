import { AccountId } from '@/lib/account/models/account'
import Profile, { Naming } from '@/lib/account/models/profile'

export type VisibilityType = 'public' | 'member'

export interface RoomOwner extends Naming {
  id: number
  firstName?: string
  lastName?: string
  avatarUrl?: string
}

export interface Room {
  id: number
  ownerId: AccountId
  owner?: RoomOwner
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
  | 'owner'
>

export const getRoomURL = (room: Room | RoomPublic, query = '') =>
  `/r/${room.slug}${query ? `?${query}` : ''}`

export const isEditable = (room: Room, profile: Profile) =>
  room.ownerId === profile.accountId
