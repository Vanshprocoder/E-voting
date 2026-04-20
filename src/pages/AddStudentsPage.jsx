import React, { useState } from "react"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../services/firebase"
import { useElectionData } from "../hooks/useElectionData"

export default function AddStudentsPage() {
  const { students, loading, error } = useElectionData()
  const [form, setForm] = useState({ name: "", className: "" })
  const [saving, setSaving] = useState(false)
  const inputClassName =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"

  async function handleAddStudent(e) {
    e.preventDefault()
    setSaving(true)

    try {
      await addDoc(collection(db, "students"), {
        name: form.name.trim(),
        class: form.className.trim(),
      })
      setForm({ name: "", className: "" })
    } catch (err) {
      alert(err?.message || "Failed to add student")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center text-gray-600">
        Loading students...
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
      <h1 className="text-3xl font-semibold text-slate-900">Add Students</h1>
      <p className="mt-2 text-sm text-slate-600 sm:text-base">
        Add new students to the election system.
      </p>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Student details</h3>
        <form onSubmit={handleAddStudent} className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Student name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className={inputClassName}
          />

          <input
            type="text"
            placeholder="Class (e.g. 10-A)"
            value={form.className}
            onChange={(e) => setForm((f) => ({ ...f, className: e.target.value }))}
            required
            className={inputClassName}
          />

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-5"
            >
              {saving ? "Saving..." : "Add student"}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Current students ({students.length})
        </h3>
        {students.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-slate-600">
            No students found.
          </p>
        ) : (
          <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {students.map((student) => (
              <li key={student.id} className="p-4 sm:p-5">
                <div className="font-semibold text-slate-900">{student.name || "Unnamed"}</div>
                <div className="text-sm text-slate-600">{student.class || "Class not set"}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
