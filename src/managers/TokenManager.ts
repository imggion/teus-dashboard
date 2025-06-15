export class TokenManager {
  private static accessToken: string | null = null
  private static refreshToken: string | null = null

  static setAccessToken(token: string | null) {
    TokenManager.accessToken = token
    if (token) {
      localStorage.setItem('accessToken', token)
    } else {
      localStorage.removeItem('accessToken')
    }
  }

  static setRefreshToken(token: string | null) {
    TokenManager.refreshToken = token
    if (token) {
      localStorage.setItem('refreshToken', token)
    } else {
      localStorage.removeItem('refreshToken')
    }
  }

  static getAccessToken(): string | null {
    if (!TokenManager.accessToken) {
      TokenManager.accessToken = localStorage.getItem('accessToken')
    }
    return TokenManager.accessToken
  }

  static getRefreshToken(): string | null {
    if (!TokenManager.refreshToken) {
      TokenManager.refreshToken = localStorage.getItem('refreshToken')
    }
    return TokenManager.refreshToken
  }

  static clearTokens() {
    TokenManager.accessToken = null
    TokenManager.refreshToken = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}
