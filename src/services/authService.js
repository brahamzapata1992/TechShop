import { readStorage, writeStorage } from '../utils/storage'

const USERS_KEY = 'techstore_users'
const SESSION_KEY = 'techstore_session'

const seedAdmin = () => {
  const users = readStorage(USERS_KEY, [])
  if (!users.some((user) => user.email === 'admin@techstore.com')) {
    users.push({ id: 'admin-1', name: 'Administrador', lastName: 'TechStore', email: 'admin@techstore.com', password: 'Admin123', role: 'admin' })
    writeStorage(USERS_KEY, users)
  }
}

seedAdmin()

export function registerUser(payload) {
  const users = readStorage(USERS_KEY, [])
  if (users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error('Este correo ya está registrado.')
  }
  const user = { id: crypto.randomUUID(), ...payload, role: 'customer' }
  users.push(user)
  writeStorage(USERS_KEY, users)
  const safeUser = { ...user }
  delete safeUser.password
  writeStorage(SESSION_KEY, safeUser)
  return safeUser
}

export function loginUser(email, password) {
  const users = readStorage(USERS_KEY, [])
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password)
  if (!user) throw new Error('Correo o contraseña incorrectos.')
  const safeUser = { ...user }
  delete safeUser.password
  writeStorage(SESSION_KEY, safeUser)
  return safeUser
}

export const getSession = () => readStorage(SESSION_KEY, null)
export const logoutUser = () => localStorage.removeItem(SESSION_KEY)
