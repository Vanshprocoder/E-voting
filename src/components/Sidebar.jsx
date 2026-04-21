// import React from "react"
// import { NavLink } from "react-router-dom"

// const linkClass = ({ isActive }) =>
//   [
//     "rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:text-base",
//     isActive ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100 hover:text-primary",
//   ].join(" ")

// const Sidebar = () => {
//   return (
//     <aside className="w-full shrink-0 border-b border-gray-200 bg-white shadow-sm md:w-64 md:border-b-0 md:border-r md:shadow-md">
//       <div className="p-4 sm:p-5">
//         <h2 className="mb-3 text-lg font-bold text-gray-900 sm:mb-4 sm:text-xl">Menu</h2>

//         <nav className="flex flex-row flex-wrap gap-2 md:flex-col md:gap-1">
//           <NavLink to="/" end className={linkClass}>
//             Dashboard
//           </NavLink>
//           <NavLink to="/vote" className={linkClass}>
//             Vote
//           </NavLink>
//           <NavLink to="/candidates" className={linkClass}>
//             Candidates
//           </NavLink>
//           <NavLink to="/admin" className={linkClass}>
//             Admin
//           </NavLink>
//         </nav>
//       </div>
//     </aside>
//   )
// }

// export default Sidebar


import React, { useEffect, useState } from "react"
import { NavLink, Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const linkClass = ({ isActive }) =>
  [
    "rounded-xl px-3 py-2.5 text-sm font-medium transition",
    isActive
      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
      : "text-slate-700 hover:bg-slate-100",
  ].join(" ")

const Sidebar = () => {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  function closeSidebar() {
    setIsOpen(false)
  }

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((v) => !v)}
        className="fixed left-3 top-3 z-50 rounded-lg border border-slate-200 bg-white px-3 py-2 text-lg text-slate-700 shadow-sm md:hidden"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white transition-transform duration-300 md:static md:w-64 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 pt-16 sm:p-5 sm:pt-16 md:pt-5">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-900">Menu</h2>

          <nav className="flex flex-col gap-2">
            {/* Public */}
            <NavLink to="/dashboard" end className={linkClass} onClick={closeSidebar}>
              Dashboard
            </NavLink>

            {/* Teacher */}
            {user?.role === "teacher" && (
              <NavLink to="/voting" className={linkClass} onClick={closeSidebar}>
                Vote
              </NavLink>
            )}

            {/* Common */}
            {user && (
              <NavLink to="/candidates" className={linkClass} onClick={closeSidebar}>
                Candidates
              </NavLink>
            )}

            {/* Teacher + Admin */}
            {(user?.role === "admin" || user?.role === "teacher") && (
              <NavLink to="/students/add" className={linkClass} onClick={closeSidebar}>
                Add Students
              </NavLink>
            )}

            {/* Admin */}
            {user?.role === "admin" && (
              <>
                <NavLink to="/admin" className={linkClass} onClick={closeSidebar}>
                  Admin
                </NavLink>
                <NavLink to="/results" className={linkClass} onClick={closeSidebar}>
                  Results
                </NavLink>
                <NavLink to="/users/add" className={linkClass} onClick={closeSidebar}>
                  Add User
                </NavLink>
              </>
            )}

            {/* Login */}
            {!user && (
              <Link
                to="/login"
                onClick={closeSidebar}
                className="rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar