import axios from 'axios'
import { CreateRoomDTO } from '../models/dto/room-dto'
import { AxiosRes, transformError } from '@/lib/common/models/api-response'
import { Room } from '../models/Room'

const apiURL = process.env.NEXT_PUBLIC_API_URL

export async function createRoom(createRoomDTO: CreateRoomDTO) {
  return axios
    .post<unknown, AxiosRes<Room>>('/play-isling/v1/rooms', createRoomDTO, {
      baseURL: apiURL,
    })
    .then((data) => data.data)
    .catch(transformError)
}
