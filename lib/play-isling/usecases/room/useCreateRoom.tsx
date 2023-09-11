import useAccount from '@/lib/account/useAccount'
import { useForm } from 'react-hook-form'
import { CreateRoomDTO } from '../../models/dto/room-dto'
import { useMutation } from '@tanstack/react-query'
import { createRoom } from '../../repo/api'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Room, getRoomURL } from '../../models/Room'
import { toast } from '@/components/atoms/use-toast'
import {
  ErrorResponse,
  SuccessResponse,
} from '@/lib/common/models/api-response'

export default function useCreateRoom() {
  const { userProfile } = useAccount({ mustLogin: true })
  const createRoomForm = useForm<CreateRoomDTO>()
  const router = useRouter()

  const { mutate, isPending } = useMutation<
    SuccessResponse<Room>,
    ErrorResponse,
    CreateRoomDTO
  >({
    mutationFn: createRoom,
    onSuccess(data) {
      const room = data.data
      const roomURL = getRoomURL(room)

      router.push(roomURL)
    },
    onError(error) {
      toast({
        title: 'Create room got error',
        description: error.errors[0],
      })
    },
  })

  const addRoom = useCallback((dto: CreateRoomDTO) => mutate(dto), [mutate])

  return {
    userProfile,
    createRoomForm,
    createRoom: addRoom,
    isCreating: isPending,
  }
}
