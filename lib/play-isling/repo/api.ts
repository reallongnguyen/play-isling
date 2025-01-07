import axios from 'axios'
import { CreateRoomDTO } from '../models/dto/room-dto'
import {
  AxiosRes,
  SuccessResponse,
  transformError,
} from '@/lib/common/models/api-response'
import { Room, RoomPublic } from '../models/Room'
import { Collection } from '@/lib/common/models/collections'
import { HomeDTO } from '../models/dto/home-dto'
import { CreateAction } from '../models/dto/action'
import { getToken } from '@/lib/account/repo/token'
import { getGuestLocalStorage } from './guest'

const apiURL = process.env.NEXT_PUBLIC_API_URL

const rooms: Record<string, any> = {
  'room-1': {
    id: 1,
    ownerId: 1,
    owner: {
      id: 1,
      firstName: 'isling',
    },
    visibility: 'public',
    name: 'Room 1',
    slug: 'room-1',
    cover:
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=2936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    audienceCount: 0,
    audiences: [],
  },
  'room-2': {
    id: 2,
    ownerId: 1,
    owner: {
      id: 1,
      firstName: 'isling',
    },
    visibility: 'public',
    name: 'Room 2',
    slug: 'room-2',
    cover:
      'https://images.unsplash.com/photo-1527628173875-3c7bfd28ad78?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    audienceCount: 0,
    audiences: [],
  },
  'room-3': {
    id: 3,
    ownerId: 1,
    owner: {
      id: 1,
      firstName: 'isling',
    },
    visibility: 'public',
    name: 'Room 3',
    slug: 'room-3',
    cover:
      'https://plus.unsplash.com/premium_photo-1676478746990-4ef5c8ef234a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    audienceCount: 0,
    audiences: [],
  },
  'room-4': {
    id: 4,
    ownerId: 1,
    owner: {
      id: 1,
      firstName: 'isling',
    },
    visibility: 'public',
    name: 'Room 4',
    slug: 'room-4',
    cover:
      'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    audienceCount: 0,
    audiences: [],
  },
  'room-5': {
    id: 5,
    ownerId: 1,
    owner: {
      id: 1,
      firstName: 'isling',
    },
    visibility: 'public',
    name: 'Room 5',
    slug: 'room-5',
    cover:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    audienceCount: 0,
    audiences: [],
  },
  'room-6': {
    id: 6,
    ownerId: 1,
    owner: {
      id: 1,
      firstName: 'isling',
    },
    visibility: 'public',
    name: 'Room 6',
    slug: 'room-6',
    cover:
      'https://images.unsplash.com/photo-1517867065801-e20f409696b0?q=80&w=2971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    audienceCount: 0,
    audiences: [],
  },
}

const homeDTO: HomeDTO = {
  collections: [
    {
      id: '1',
      name: 'For You',
      rooms: Object.values(rooms) as RoomPublic[],
    },
  ],
}

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
  const response = {
    success: true,
    code: 200,
    message: 'success',
    data: rooms[slug],
  } as SuccessResponse<Room>

  return () => response
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
  const response = {
    success: true,
    code: 200,
    message: 'success',
    data: homeDTO,
  } as SuccessResponse<HomeDTO>

  return response
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
