import React, { useState } from "react"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../services/firebase"

export default function AddUserPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "teacher",
  })
  const [saving, setSaving] = useState(false)
  const inputClassName =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"

  async function handleAddUser(e) {
    e.preventDefault()
    setSaving(true)

    try {
      await addDoc(collection(db, "users"), {
        username: form.username.trim(),
        password: form.password,
        role: form.role,
      })
      setForm({ username: "", password: "", role: "teacher" })
      alert("User added successfully")
    } catch (err) {
      alert(err?.message || "Failed to add user")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl text-left">
      <h1 className="text-3xl font-semibold text-slate-900">Add User</h1>
      <p className="mt-2 text-sm text-slate-600 sm:text-base">
        Create a login user with username, password, and role.
      </p>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">User details</h3>
        <form onSubmit={handleAddUser} className="grid gap-3">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            required
            className={inputClassName}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            className={inputClassName}
          />

          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className={inputClassName}
          >
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-5"
          >
            {saving ? "Saving..." : "Add user"}
          </button>
        </form>
      </section>
    </div>
  )
}
