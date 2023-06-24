import { useCallback, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getToken, removeToken } from './repo/token'
import { logout } from './repo/api'

export interface UseSignOutParams {
  autoSignOut?: boolean
  redirectURL?: string
}

const defaultConfig: UseSignOutParams = {
  autoSignOut: true,
  redirectURL: '/',
}

export default function useSignOut(config: UseSignOutParams = defaultConfig) {
  const cfg = Object.assign({}, defaultConfig, config)

  const { mutateAsync } = useMutation({
    mutationFn: logout,
  })
  const pathName = usePathname()
  const searchParam = useSearchParams()
  const router = useRouter()

  const signOut = useCallback(
    async (redirectURL?: string) => {
      const token = getToken()
      if (token) {
        await mutateAsync(token.refreshToken).catch((err) =>
          console.debug('useSignOut: revoke a refresh token:', err.message)
        )
      }

      removeToken()

      if (redirectURL) {
        // reload by set href to clear all recoil store
        window.location.href = redirectURL

        return
      }

      // we reload this page to clear all recoil store
      const query = [searchParam.toString(), 'signOut=success']

      if (redirectURL && !searchParam.has('redirect')) {
        query.push(`redirect=${redirectURL}`)
      }

      window.location.href = `${pathName}?${query.join('&')}`
    },
    [mutateAsync, pathName, searchParam]
  )

  useEffect(() => {
    // handle sign out success
    if (searchParam.get('signOut') === 'success') {
      const redirect = searchParam.get('redirect')
      if (redirect) {
        router.replace(redirect)
      }

      return
    }

    if (cfg.autoSignOut) {
      signOut(cfg.redirectURL)
    }
  }, [cfg.autoSignOut, cfg.redirectURL, router, searchParam, signOut])

  return { signOut }
}
