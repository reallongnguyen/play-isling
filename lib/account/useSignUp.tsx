import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/atoms/use-toast'

import { signUpAccount } from './repo/api'
import { SignUpDTO, SignUpRequest, TokenResponse } from './models/dto'
import { ErrorResponse, SuccessResponse } from '../common/models/api-response'
import { getToken, setToken } from './repo/token'
import { useForm } from 'react-hook-form'

export default function useSignUp() {
  const signUpForm = useForm<SignUpDTO>()
  const router = useRouter()

  const { mutate: signUp, isPending } = useMutation<
    SuccessResponse<TokenResponse>,
    ErrorResponse,
    SignUpRequest
  >({
    mutationFn: signUpAccount,
    onSuccess: (resData) => {
      setToken(resData.data)
      router.push('/me/profile/edit')
    },
    onError: (error) => {
      let errorMessage = error.errors[0]

      if (error.code === 400) {
        errorMessage = 'Email address is incorrect format'

        if (
          error.errors[0] &&
          error.errors[0].toString().includes('email address duplicated')
        ) {
          errorMessage = 'Email address has already exist'
          signUpForm.setError('email', { message: errorMessage })
        }
      }

      toast({
        title: 'Sign Up error',
        description: errorMessage,
      })
    },
  })

  const handleSignUp = useCallback(
    (data: SignUpRequest) => signUp(data),
    [signUp]
  )

  // redirect if found token on local storage
  useEffect(() => {
    const savedToken = getToken()
    if (savedToken) {
      router.replace('/')
    }
  }, [router])

  return {
    handleSignUp,
    isLoading: isPending,
    signUpForm,
  }
}
