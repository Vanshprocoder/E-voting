import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, role, roles }) {
  const user = JSON.parse(localStorage.getItem("user"))

  if (!user) return <Navigate to="/" />

  if (role && user.role !== role) {
    return <Navigate to="/" />
  }

  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />
  }

  return children
}