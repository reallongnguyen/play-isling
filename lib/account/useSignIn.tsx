import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { getTokenByPassword } from './repo/api'
import { SignInRequest, TokenResponse } from './models/dto'
import { ErrorResponse, SuccessResponse } from '../common/models/api-response'
import { getToken, setToken } from './repo/token'
import { toast } from '@/components/atoms/use-toast'
import { useForm } from 'react-hook-form'

export default function useSignIn() {
  const signInForm = useForm<SignInRequest>()
  const router = useRouter()

  const { mutate: signIn, isPending } = useMutation<
    SuccessResponse<TokenResponse>,
    ErrorResponse,
    SignInRequest
  >({
    mutationFn: getTokenByPassword,
    onSuccess: (resData) => {
      setToken(resData.data)
      router.push('/')
    },
    onError: (error) => {
      if (error.code === 401) {
        toast({
          title: 'Sign In error',
          description: 'Your Email and Password does not match',
        })

        signInForm.setError('email', {
          message: 'Your Email and Password does not match',
        })
        signInForm.setError('password', {
          message: 'Your Email and Password does not match',
        })
      }

      if (error.code === 400) {
        toast({
          title: 'Sign In error',
          description: 'Email address is incorrect format',
        })
        signInForm.setError('email', {
          message: 'Email address is incorrect format',
        })
      }
    },
  })

  const handleSignIn = useCallback(
    (data: SignInRequest) => {
      signIn(data)
    },
    [signIn]
  )

  // redirect if found token on local storage
  useEffect(() => {
    const savedToken = getToken()
    if (savedToken) {
      router.replace('/')
    }
  }, [router])

  return {
    signInForm,
    handleSignIn,
    isLoading: isPending,
  }
}
