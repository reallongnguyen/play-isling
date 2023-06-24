import { AccountId } from '@/lib/account/models/account'

export type AudienceType = 'public' | 'member'

export interface Room {
  id: number
  owner: AccountId
  sharingTo: AudienceType
  inviteCode?: string
  name: string
  slug: string
  cover: string
  description?: string
  audienceCount: number
  audiences: number[]
}

export type RoomPublic = Pick<
  Room,
  'id' | 'name' | 'slug' | 'cover' | 'description'
>

export const getRoomURL = (room: Room | RoomPublic) => `/r/${room.slug}`
