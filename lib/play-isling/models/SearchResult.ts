import { Collection } from '@/lib/common/models/collections'
import { RoomPublic } from './Room'

export interface SearchResult {
  rooms?: Collection<RoomPublic>
}
