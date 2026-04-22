import * as React from "react"

const TOKEN_KEY = "hirebox_token"
const REFRESH_TOKEN_KEY = "hirebox_refresh_token"

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(
  () => typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null
)

  function login(accessToken: string, refreshToken: string) {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    setToken(accessToken)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider")
  return ctx
}
