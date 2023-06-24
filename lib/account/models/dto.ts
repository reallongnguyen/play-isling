import dayjs from 'dayjs'

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
}

export interface SignUpDTO extends SignInRequest {
  confirmPassword: string
}

export interface UpdateProfileDTO {
  firstName: string
  lastName?: string
  gender: string
  dayOfBirth: string
  monthOfBirth: string
  yearOfBirth: string
}

export interface UpdateProfileRequest {
  firstName: string
  lastName?: string
  gender: string
  dateOfBirth: string
}

export function toUpdateProfileRequest(
  dto: UpdateProfileDTO
): UpdateProfileRequest {
  return {
    ...dto,
    lastName: dto.lastName ? dto.lastName : undefined,
    dateOfBirth: dayjs(
      `${dto.yearOfBirth}-${dto.monthOfBirth}-${dto.dayOfBirth}`
    ).format('YYYY-MM-DD'),
  }
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}
