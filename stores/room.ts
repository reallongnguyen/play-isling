import { RoomLayout } from '@/lib/play-isling/models/RoomLayout'
import { atom } from 'recoil'

export const roomLayoutStore = atom<RoomLayout>({
  key: 'roomLayoutStore',
  default: 'normal' as RoomLayout,
})

export const isShowQRStore = atom({
  key: 'isShowQRStore',
  default: false,
})

export const isForceShowPlaylistStore = atom({
  key: 'isForceShowPlaylistStore',
  default: false,
})
