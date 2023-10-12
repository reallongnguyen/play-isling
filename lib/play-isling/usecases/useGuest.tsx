import { useCallback, useEffect, useState } from 'react'
import useAccount from '@/lib/account/useAccount'
import { Gender } from '@/lib/account/models/profile'
import { randomBase56 } from '@/lib/utils'
import { surreal } from '@/lib/common/repo/surreal'
import { Guest } from '../models/Guest'

const characters = [
  'Gorilla',
  'Monkey',
  'Galapagos Tortoise',
  'Great White Shark',
  'Greyhound',
  'Cottontop Tamarin',
  'Lobster',
  'Bactrian Camel',
  'African Forest Elephant',
  'Clown Fish',
  'Pelican',
  'Snowy Owl',
  'Fly',
  'Barracuda',
  'Tuatara',
  'Elephant Shrew',
  'Bengal Tiger',
  'Pygmy Hippopotamus',
  'Horned Frog',
  'Black Bear',
  'White Bear',
  'Fox',
  'Hamster',
  'Panther',
  'Bison',
  'Red Panda',
  'Flying Squirrel',
  'Llama',
  'Okapi',
  'Balinese',
  'Markhor',
  'Panda',
]

let initGuestPromise: Promise<Guest> | undefined

const initGuest = async () => {
  const guestId = 'guest_' + randomBase56()
  const firstName =
    characters[Math.round(Math.random() * (characters.length - 1))]

  const guest: Guest = {
    accountId: 0,
    guestId,
    id: `users:${guestId}`,
    email: `${guestId}@isling.me`,
    firstName,
    lastName: 'Anonymous',
    gender: Gender.unknown,
    dateOfBirth: new Date('2000-1-1'),
    avatarUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=${firstName}`,
    version: 20231013,
    isGuest: true,
  }

  await surreal
    .waitConnected()
    .then(() =>
      surreal
        .getConn()
        .create('users', guest as unknown as Record<string, unknown>)
    )

  localStorage.setItem('isling_play_guestData', JSON.stringify(guest))

  return guest
}

function useGuest() {
  const { isLoading, userProfile } = useAccount({ mustLogin: false })
  const [guestProfile, setGuestProfile] = useState<Guest>()
  const [isCreatingGuest, setIsCreatingGuest] = useState(true)

  const isGuest = typeof userProfile === 'undefined'

  const getGuestData = useCallback(() => {
    const guestData = localStorage.getItem('isling_play_guestData')

    if (!guestData) {
      return undefined
    }

    return JSON.parse(guestData) as Guest
  }, [])

  const createGuest = useCallback(async () => {
    let guest = getGuestData()

    if (!guest) {
      initGuestPromise = initGuestPromise || initGuest()

      guest = await initGuestPromise.finally(() => {
        initGuestPromise = undefined
      })
    }

    setGuestProfile(guest)
  }, [getGuestData])

  useEffect(() => {
    if (isLoading || !isGuest) {
      setIsCreatingGuest(false)

      return
    }

    setIsCreatingGuest(true)
    createGuest().finally(() => setIsCreatingGuest(false))
  }, [createGuest, isGuest, isLoading])

  return {
    isLoading: isLoading || isCreatingGuest,
    isGuest,
    guestProfile,
  }
}

export default useGuest
