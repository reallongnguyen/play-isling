import { atom } from 'recoil'

export const searchVideoQueryStore = atom<string>({
  key: 'searchVideoQueryStore',
  default: '',
})
