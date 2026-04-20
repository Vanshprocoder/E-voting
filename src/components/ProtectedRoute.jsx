import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children, role, roles }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/voting"} replace />
  }

  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/voting"} replace />
  }

  return children
}