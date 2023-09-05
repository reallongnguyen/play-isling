import { RoomPublic } from './Room'

export interface RoomCollection {
  id: string
  name: string
  rooms: RoomPublic[]
}
