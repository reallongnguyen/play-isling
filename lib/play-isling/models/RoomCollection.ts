import { RoomPublic } from './Room'

export interface RoomCollection {
  id: number
  name: string
  rooms: RoomPublic[]
}
