import { getUser } from './storage'

export const getCurrentUser = () => getUser()
export const getCurrentRole = () => getUser()?.role ?? null
export const isAdmin        = () => getUser()?.role === 'admin'
export const isStudent      = () => getUser()?.role === 'student'
