
import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const titles = {
  "/dashboard": "Dashboard",
  "/voting": "Vote",
  "/candidates": "Candidates",
  "/admin": "Admin",
  "/students/add": "Add Students",
  "/users/add": "Add User",
}

const Navbar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const label = titles[pathname] ?? "Student Union"
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-10 flex min-h-[56px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm">
      <Link to="/dashboard" className="font-semibold tracking-tight text-slate-900">
       School Leadership Election 2026
      </Link>

      <div className="flex items-center gap-3">
        <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:inline-flex">
          {label}
        </span>

        {!user ? (
          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Login
          </Link>
        ) : (
          <>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar