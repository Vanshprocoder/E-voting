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


import React from "react"
import { NavLink, Link } from "react-router-dom"

const linkClass = ({ isActive }) =>
  [
    "rounded-xl px-3 py-2.5 text-sm font-medium transition",
    isActive
      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
      : "text-slate-700 hover:bg-slate-100",
  ].join(" ")

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <aside className="w-full border-b border-slate-200 bg-white md:w-64 md:border-r">
      <div className="p-4 sm:p-5">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-900">Menu</h2>

        <nav className="flex flex-wrap gap-2 md:flex-col">
          {/* Public */}
          <NavLink to="/dashboard" end className={linkClass}>
            Dashboard
          </NavLink>

          {/* Teacher */}
          {user?.role === "teacher" && (
            <NavLink to="/voting" className={linkClass}>
              Vote
            </NavLink>
          )}

          {/* Common */}
          {user && (
            <NavLink to="/candidates" className={linkClass}>
              Candidates
            </NavLink>
          )}

          {/* Teacher + Admin */}
          {(user?.role === "admin" || user?.role === "teacher") && (
            <NavLink to="/students/add" className={linkClass}>
              Add Students
            </NavLink>
          )}

          {/* Admin */}
          {user?.role === "admin" && (
            <>
              <NavLink to="/admin" className={linkClass}>
                Admin
              </NavLink>
              <NavLink to="/users/add" className={linkClass}>
                Add User
              </NavLink>
            </>
          )}

          {/* Login */}
          {!user && (
            <Link
              to="/login"
              className="rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar