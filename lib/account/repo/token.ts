import { TokenResponse } from '../models/dto'

const tokenKey = 'islingPlayToken'

export function setToken(token: TokenResponse): void {
  const expireAt = Date.now() + token.expiresIn * 1000

  localStorage.setItem(tokenKey, JSON.stringify({ ...token, expireAt }))
}

export function getToken(): TokenResponse | undefined {
  const tokenJSON = localStorage.getItem(tokenKey)
  if (!tokenJSON) {
    return undefined
  }

  try {
    const token = JSON.parse(tokenJSON)

    // TODO: why it error
    if (!token.refreshToken || !token.accessToken || !token.tokenType) {
      return undefined
    }

    return token as TokenResponse
  } catch (err) {
    return undefined
  }
}

export function removeToken() {
  localStorage.removeItem(tokenKey)
}
