import axios from 'axios'
import { CreateRoomDTO } from '../models/dto/room-dto'
import { AxiosRes, transformError } from '@/lib/common/models/api-response'
import { Room } from '../models/Room'
import { Collection } from '@/lib/common/models/collections'
import { HomeDTO } from '../models/dto/home-dto'
import { CreateAction } from '../models/dto/action'
import { getToken } from '@/lib/account/repo/token'
import { getGuestLocalStorage } from './guest'

const apiURL = process.env.NEXT_PUBLIC_API_URL

export async function createRoom(createRoomDTO: CreateRoomDTO) {
  return axios
    .post<unknown, AxiosRes<Room>>('/play-isling/v1/rooms', createRoomDTO, {
      baseURL: apiURL,
    })
    .then((data) => data.data)
    .catch(transformError)
}

export async function getMyRooms() {
  return axios
    .get<unknown, AxiosRes<Collection<Room>>>('/play-isling/v1/rooms', {
      baseURL: apiURL,
    })
    .then((data) => data.data)
    .catch(transformError)
}

export function getRoom(slug: string) {
  return () =>
    axios
      .get<unknown, AxiosRes<Room>>(`/play-isling/v1/rooms/${slug}`, {
        baseURL: apiURL,
      })
      .then((data) => data.data)
      .catch(transformError)
}

export async function deleteRoom(id: number) {
  return axios
    .delete<unknown, AxiosRes<Room>>(`/play-isling/v1/rooms/${id}`, {
      baseURL: apiURL,
    })
    .then((data) => data.data)
    .catch(transformError)
}

export async function getHome() {
  return axios
    .get<unknown, AxiosRes<HomeDTO>>('/play-isling/v1/home', {
      baseURL: apiURL,
    })
    .then((data) => data.data)
    .catch(transformError)
}

export async function getHomeGuest() {
  return axios
    .get<unknown, AxiosRes<HomeDTO>>('/play-isling/v1/guest/home', {
      baseURL: apiURL,
    })
    .then((data) => data.data)
    .catch(transformError)
}

export async function createUserActivity(action: CreateAction) {
  const token = getToken()
  let guestId: string | undefined

  if (!token) {
    const guest = getGuestLocalStorage()
    guestId = guest?.guestId
  }

  return axios
    .post(
      '/tracking/v1/user-activities',
      { ...action, app: action.app || 'play' },
      {
        baseURL: apiURL,
        headers: {
          'X-Guest-ID': guestId,
        },
      }
    )
    .then((data) => data.data)
    .catch(transformError)
}

export async function logCCU() {
  const token = getToken()
  let guestId: string | undefined

  if (!token) {
    const guest = getGuestLocalStorage()
    guestId = guest?.guestId
  }

  return axios
    .post('/tracking/v1/ccu-logs', undefined, {
      baseURL: apiURL,
      headers: {
        'X-Guest-ID': guestId,
      },
    })
    .then((data) => data.data)
    .catch(transformError)
}
