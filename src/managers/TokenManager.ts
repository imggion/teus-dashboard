export class TokenManager {
  private static accessToken: string | null = null
  private static refreshToken: string | null = null

  static setAccessToken(token: string | null) {
    TokenManager.accessToken = token
    if (token) {
      localStorage.setItem('teus_accessToken', token)
    } else {
      localStorage.removeItem('teus_accessToken')
    }
  }

  static setRefreshToken(token: string | null) {
    TokenManager.refreshToken = token
    if (token) {
      localStorage.setItem('teus_refreshToken', token)
    } else {
      localStorage.removeItem('teus_refreshToken')
    }
  }

  static getAccessToken(): string | null {
    if (!TokenManager.accessToken) {
      TokenManager.accessToken = localStorage.getItem('teus_accessToken')
    }
    return TokenManager.accessToken
  }

  static getRefreshToken(): string | null {
    if (!TokenManager.refreshToken) {
      TokenManager.refreshToken = localStorage.getItem('teus_refreshToken')
    }
    return TokenManager.refreshToken
  }

  static clearTokens() {
    TokenManager.accessToken = null
    TokenManager.refreshToken = null
    localStorage.removeItem('teus_accessToken')
    localStorage.removeItem('teus_refreshToken')
  }
}
