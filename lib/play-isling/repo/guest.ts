import { Guest } from '../models/Guest'

const guestDataKey = 'isling_play_guestData'

export const getGuestLocalStorage = () => {
  const guestData = localStorage.getItem(guestDataKey)

  if (!guestData) {
    return undefined
  }

  return JSON.parse(guestData) as Guest
}

export const setGuestLocalStorage = (guest: Guest) => {
  localStorage.setItem(guestDataKey, JSON.stringify(guest))
}
