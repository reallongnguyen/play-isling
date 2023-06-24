import axios, { AxiosError } from 'axios'
import ApiResponse, { ErrorResponse } from '@/lib/common/models/api-response'
import { TokenResponse } from '../models/dto'
import { getToken, setToken } from './token'
import { getTokenByRefreshToken } from './api'

const API_URL = process.env.NEXT_PUBLIC_API_URL
let renewAccessToken: Promise<ApiResponse<TokenResponse>> | undefined

function getAuthorizationString(token: TokenResponse) {
  const tokenType = `${token.tokenType[0].toUpperCase()}${token.tokenType.slice(
    1
  )}`

  return `${tokenType} ${token.accessToken}`
}

export function configAxiosInterceptor() {
  axios.interceptors.request.use((config) => {
    if (!API_URL || !(config.baseURL || config.url)?.startsWith(API_URL)) {
      return config
    }

    const token = getToken()

    if (token) {
      config.headers.Authorization = getAuthorizationString(token)
    }

    if (!token && config.headers.Authorization) {
      config.headers.Authorization = null
    }

    return config
  })

  axios.interceptors.response.use(undefined, async (error: AxiosError) => {
    if (error.config && error.response && error.response.status === 401) {
      if (error.config.url?.startsWith('v1/auth/tokens')) {
        console.debug('axiosConfig: prevent retry get token API')

        return Promise.reject(error)
      }

      // trying renew access token by fresh token
      const token = getToken()
      if (!token) {
        return Promise.reject(error)
      }

      renewAccessToken =
        renewAccessToken || getTokenByRefreshToken(token.refreshToken)

      try {
        const renewRes = await renewAccessToken
        setToken(renewRes.data)
        error.config.headers.Authorization = getAuthorizationString(
          renewRes.data
        )

        // re-request with the new access token
        return axios.request(error.config)
      } catch (err) {
        if ((err as ErrorResponse).code === 401) {
          console.debug(
            'axiosConfig: renew access token -> refresh token invalid -> sign out'
          )
          window.location.href = '/signout'
        }
      } finally {
        renewAccessToken = undefined
      }
    }

    return Promise.reject(error)
  })
}
