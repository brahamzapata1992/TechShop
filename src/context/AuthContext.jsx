import { createContext, useContext, useMemo, useState } from 'react'
import { getSession, loginUser, logoutUser, registerUser } from '../services/authService'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSession())
  const login = (email, password) => setUser(loginUser(email, password))
  const register = (payload) => setUser(registerUser(payload))
  const logout = () => { logoutUser(); setUser(null) }
  const value = useMemo(() => ({ user, login, register, logout, isAdmin: user?.role === 'admin' }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
