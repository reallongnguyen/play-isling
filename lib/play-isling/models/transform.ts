import { Room, RoomPublic } from './Room'

export const toRoomPublic = (room: Room): RoomPublic => {
  return {
    id: room.id,
    owner: room.owner,
    name: room.name,
    slug: room.slug,
    cover: room.cover,
    description: room.description,
    visibility: room.visibility,
    audienceCount: room.audienceCount,
    audiences: room.audiences,
  }
}
