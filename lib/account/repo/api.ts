import axios from 'axios'
import { AxiosRes, transformError } from '@/lib/common/models/api-response'
import {
  SignInRequest,
  SignUpRequest,
  TokenResponse,
  UpdateProfileRequest,
} from '../models/dto'
import Profile, { Gender } from '../models/profile'

const baseAccountApiUrl = process.env.NEXT_PUBLIC_API_URL

export async function getTokenByPassword(signInRequest: SignInRequest) {
  const url = `v1/auth/tokens?grant_type=password&email=${signInRequest.email}&password=${signInRequest.password}`

  return axios
    .post<unknown, AxiosRes<TokenResponse>>(
      url,
      {},
      { baseURL: baseAccountApiUrl }
    )
    .then((res) => res.data)
    .catch(transformError)
}

export async function getTokenByRefreshToken(refreshToken: string) {
  const url = `v1/auth/tokens?grant_type=refresh_token&refresh_token=${refreshToken}`

  return axios
    .post<unknown, AxiosRes<TokenResponse>>(
      url,
      {},
      { baseURL: baseAccountApiUrl }
    )
    .then((res) => res.data)
    .catch(transformError)
}

export async function logout(refreshToken: string) {
  const url = `v1/auth/logout?refresh_token=${refreshToken}`

  return axios
    .post<unknown, AxiosRes<TokenResponse>>(
      url,
      {},
      { baseURL: baseAccountApiUrl }
    )
    .then((res) => res.data)
    .catch(transformError)
}

export async function getUserProfile() {
  const url = `v1/profiles/me`

  return axios
    .get<unknown, AxiosRes<Profile>>(url, {
      baseURL: baseAccountApiUrl,
    })
    .then((res) => ({
      ...res.data,
      data: {
        ...res.data.data,
        gender: res.data.data.gender
          ? (res.data.data.gender as Gender)
          : undefined,
        dateOfBirth: res.data.data.dateOfBirth
          ? new Date(res.data.data.dateOfBirth)
          : undefined,
      },
    }))
    .catch(transformError)
}

export async function upsertUserProfile(profile: UpdateProfileRequest) {
  const url = `v1/profiles/me`

  return axios
    .post<unknown, AxiosRes<Profile>>(url, profile, {
      baseURL: baseAccountApiUrl,
    })
    .then((res) => res.data)
    .catch(transformError)
}

export async function signUpAccount(signUpReq: SignUpRequest) {
  const url = `v1/auth/signup`

  return axios
    .post<unknown, AxiosRes<TokenResponse>>(url, signUpReq, {
      baseURL: baseAccountApiUrl,
    })
    .then((res) => res.data)
    .catch(transformError)
}
