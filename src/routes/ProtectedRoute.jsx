import { Navigate, Outlet } from 'react-router-dom'
import { getUser } from '../utils/storage'

/**
 * Generic protected route.
 *
 * Props:
 *   requiredRole  — 'student' | 'admin' | undefined
 *
 * Behaviour:
 *   - Not logged in               → /login
 *   - Logged in, wrong role       → appropriate fallback dashboard
 *   - Logged in, correct role     → render children
 */
export default function ProtectedRoute({ requiredRole }) {
  const user = getUser()

  if (!user) return <Navigate to="/login" replace />

  if (requiredRole) {
    if (user.role !== requiredRole) {
      // Admin trying student route → their admin dashboard
      // Student trying admin route → their student dashboard
      return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
    }
  }

  return <Outlet />
}
