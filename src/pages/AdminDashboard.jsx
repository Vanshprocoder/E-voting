import React, { useState } from "react"
import { useElectionData } from "../hooks/useElectionData"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { students, candidates, votes, loading, error, addCandidate, usesFirebase } =
    useElectionData()

  const [form, setForm] = useState({ name: "", position: "Head Boy", photo: "" })
  const [saving, setSaving] = useState(false)
  const inputClassName =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await addCandidate(form)
      setForm({ name: "", position: "Head Boy", photo: "" })
    } catch (err) {
      alert(err?.message || "Could not add candidate")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center text-gray-600">
        Loading…
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <p className="font-medium">Firebase error</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl text-left">
      {usesFirebase && (
        <p className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Connected to Firebase Realtime Database — changes sync for all users.
        </p>
      )}

      <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600 sm:text-base">
        Add candidates and view basic stats.
      </p>

      <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Add new candidate</h3>
          <form onSubmit={handleAdd} className="grid gap-3">
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className={inputClassName}
            />

            <select
              value={form.position}
              onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
              className={inputClassName}
            >
              <option>Head Boy</option>
              <option>Head Girl</option>
            </select>

            <input
              placeholder="Photo URL (optional)"
              value={form.photo}
              onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))}
              className={inputClassName}
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-5"
            >
              {saving ? "Saving…" : "Add candidate"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Quick stats</h3>
          <div className="grid gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm text-slate-600">Total students</div>
              <div className="text-xl font-semibold text-slate-900">{students.length}</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm text-slate-600">Votes cast</div>
              <div className="text-xl font-semibold text-slate-900">
                {Object.keys(votes).length}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/results")}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto sm:px-5"
            >
              View results
            </button>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Current candidates</h3>
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {candidates.map((c) => (
            <li key={c.id} className="p-4 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="text-sm text-slate-600">{c.position}</div>
                </div>
                <button
                  type="button"
                  disabled
                  className="shrink-0 self-start rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-sm text-slate-500 sm:self-center"
                >
                  Actions
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
