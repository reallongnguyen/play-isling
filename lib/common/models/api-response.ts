import { AxiosError, HttpStatusCode } from 'axios'

export interface ApiError {
  code: number
  message: string
}

export interface SuccessResponse<T> {
  success: boolean
  code: number
  message: string
  data: T
  errors: never
}

export interface ErrorResponse {
  success: boolean
  code: number
  message: string
  data: never
  errors: string[] | ApiError[]
}

export interface AxiosRes<T = unknown> {
  code: HttpStatusCode
  data: SuccessResponse<T>
}

export const transformError = (err: AxiosError) => {
  if (!err || !err.response) {
    throw {
      success: false,
      code: 600,
      message: 'unexpected error',
      errors: [err.message],
    } as ErrorResponse
  }

  throw err.response.data as ErrorResponse
}
