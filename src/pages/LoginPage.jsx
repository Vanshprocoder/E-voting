import React, { useState } from "react"
import { db } from "../services/firebase"
import { collection, getDocs } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const inputClassName =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const snapshot = await getDocs(collection(db, "users"))

      let foundUser = null

      snapshot.forEach((doc) => {
        const data = doc.data()
        if (
          data.username === form.username &&
          data.password === form.password
        ) {
          foundUser = data
        }
      })

      if (!foundUser) {
        alert("Invalid credentials")
        return
      }

      // 🔐 Store session (basic)
      localStorage.setItem("user", JSON.stringify(foundUser))

      // 🔀 Role-based redirect
      if (foundUser.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/voting")
      }

    } catch (err) {
      alert("Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8"
      >
        <div className="mb-6 space-y-1">
          <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-600">Sign in to continue to Student Union Voting.</p>
        </div>

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm((f) => ({ ...f, username: e.target.value }))
          }
          className={`${inputClassName} mb-3`}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm((f) => ({ ...f, password: e.target.value }))
          }
          className={`${inputClassName} mb-5`}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}