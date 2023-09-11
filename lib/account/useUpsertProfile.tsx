import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { toast } from '@/components/atoms/use-toast'
import { Validate } from 'react-hook-form'
import validator from 'validator'

import { upsertUserProfile } from './repo/api'
import {
  UpdateProfileDTO,
  UpdateProfileRequest,
  toUpdateProfileRequest,
} from './models/dto'
import { ErrorResponse, SuccessResponse } from '../common/models/api-response'
import { useForm } from 'react-hook-form'
import Profile from './models/profile'
import useAccount from './useAccount'
import dayjs from 'dayjs'

export default function useUpsertProfile() {
  const {
    userProfile,
    isLoading: isLoadingAuth,
    refetchProfile,
  } = useAccount({
    mustLogin: true,
  })
  const editProfileForm = useForm<UpdateProfileDTO>()

  const { mutate: upsertProfileMutate, isPending } = useMutation<
    SuccessResponse<Profile>,
    ErrorResponse,
    UpdateProfileRequest
  >({
    mutationFn: upsertUserProfile,
    onSuccess: () => {
      refetchProfile()
      toast({
        title: 'Update profile successfully',
      })
    },
    onError: (error) => {
      const errorMessage = error.errors[0]

      toast({
        title: 'Update profile error',
        description: errorMessage,
      })
    },
  })

  const handleUpsertProfile = useCallback(
    (data: UpdateProfileDTO) =>
      upsertProfileMutate(toUpdateProfileRequest(data)),
    [upsertProfileMutate]
  )

  const setFormValuesByProfile = useCallback(() => {
    if (userProfile && userProfile.firstName) {
      editProfileForm.setValue('firstName', userProfile.firstName)
      editProfileForm.setValue('lastName', userProfile.lastName)
      editProfileForm.setValue('gender', String(userProfile.gender))

      const dateOfBirth = userProfile.dateOfBirth
      if (dateOfBirth) {
        editProfileForm.setValue('yearOfBirth', `${dateOfBirth.getFullYear()}`)
        editProfileForm.setValue(
          'monthOfBirth',
          `${dateOfBirth.getMonth() + 1}`.padStart(2, '0')
        )
        editProfileForm.setValue(
          'dayOfBirth',
          `${dateOfBirth.getDate()}`.padStart(2, '0')
        )
      }
    }
  }, [editProfileForm, userProfile])

  useEffect(() => {
    setFormValuesByProfile()
  }, [setFormValuesByProfile])

  return {
    handleUpsertProfile,
    isLoading: isPending,
    editProfileForm,
    isLoadingAuth,
    userProfile,
    resetForm: setFormValuesByProfile,
  }
}

export const validateDateOfBirth: Validate<string, UpdateProfileDTO> = (
  v,
  { yearOfBirth, monthOfBirth, dayOfBirth }
) => {
  if (!yearOfBirth || !monthOfBirth || !dayOfBirth) {
    return true
  }

  const month = monthOfBirth.padStart(2, '0')
  const day = dayOfBirth.padStart(2, '0')

  const dateString = `${yearOfBirth}/${month}/${day}`

  return (
    (validator.isDate(dateString) &&
      dayjs(dateString).isBefore(new Date()) &&
      dayjs(dateString).isAfter('1899-12-31')) ||
    'Please enter a valid date'
  )
}
