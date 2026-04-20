import React, { useMemo, useState } from "react"

export default function StudentSelector({ students = [], value, onChange }) {
  const [query, setQuery] = useState("")
  const inputClassName =
    "box-border w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"

  const filtered = useMemo(() => {
    if (!query) return students
    return students.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
  }, [students, query])

  return (
    <div className="mx-auto w-full max-w-lg sm:mx-0">
      <label className="mb-2 block text-left text-sm font-semibold text-slate-700">
        Select student
      </label>
      <input
        aria-label="Search student"
        placeholder="Search by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`${inputClassName} mb-2`}
      />

      <select
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={inputClassName}
      >
        <option value="">-- choose student --</option>
        {filtered.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  )
}
