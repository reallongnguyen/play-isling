'use client'

import {
  LoadingHeader,
  LoadingScreen,
} from '@/components/atoms/loading-skeleton'
import useSignOut from '@/lib/account/useSignOut'

function SignOut() {
  useSignOut()

  return (
    <>
      <LoadingHeader />
      <LoadingScreen />
    </>
  )
}

export default SignOut
