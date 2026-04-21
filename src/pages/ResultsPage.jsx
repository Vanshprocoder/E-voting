import React, { useMemo } from "react"
import { useElectionData } from "../hooks/useElectionData"

const PIE_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"]

function computeResults(candidates, votes) {
  const byId = Object.fromEntries(candidates.map((c) => [c.id, c]))

  const groups = {
    "Head Boy": [],
    "Head Girl": [],
  }

  for (const candidate of candidates) {
    if (groups[candidate.position]) {
      groups[candidate.position].push({
        id: candidate.id,
        name: candidate.name,
        votes: 0,
      })
    }
  }

  Object.values(votes).forEach((vote) => {
    if (vote.headBoy && byId[vote.headBoy] && groups["Head Boy"]) {
      const row = groups["Head Boy"].find((item) => item.id === vote.headBoy)
      if (row) row.votes += 1
    }
    if (vote.headGirl && byId[vote.headGirl] && groups["Head Girl"]) {
      const row = groups["Head Girl"].find((item) => item.id === vote.headGirl)
      if (row) row.votes += 1
    }
  })

  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => b.votes - a.votes)
  }

  return groups
}

function SectionCharts({ title, data }) {
  const total = data.reduce((sum, c) => sum + c.votes, 0)
  const maxVotes = Math.max(1, ...data.map((c) => c.votes))

  const segments = data
    .map((candidate, index) => {
      const start = data
        .slice(0, index)
        .reduce((sum, prev) => sum + (total ? (prev.votes / total) * 360 : 0), 0)
      const end = start + (total ? (candidate.votes / total) * 360 : 0)
      return `${PIE_COLORS[index % PIE_COLORS.length]} ${start}deg ${end}deg`
    })
    .join(", ")

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          Total votes: {total}
        </span>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-slate-600">No candidates available.</p>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">Pie chart</h3>
              <div className="flex items-center gap-4">
                <div
                  className="h-40 w-40 rounded-full border border-slate-200"
                  style={{ background: `conic-gradient(${segments || "#e2e8f0 0deg 360deg"})` }}
                />
                <ul className="space-y-2 text-sm">
                  {data.map((candidate, index) => (
                    <li key={candidate.id} className="flex items-center gap-2 text-slate-700">
                      <span
                        className="inline-block h-3 w-3 rounded-sm"
                        style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                      />
                      {candidate.name} ({candidate.votes})
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">Bar graph</h3>
              <div className="space-y-3">
                {data.map((candidate, index) => {
                  const percent = Math.round((candidate.votes / maxVotes) * 100)
                  return (
                    <div key={candidate.id}>
                      <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
                        <span>{candidate.name}</span>
                        <span>{candidate.votes}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100">
                        <div
                          className="h-2.5 rounded-full transition-all"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Leaderboard</h3>
            <ol className="space-y-2">
              {data.map((candidate, index) => (
                <li
                  key={candidate.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-800">
                    #{index + 1} {candidate.name}
                  </span>
                  <span className="font-semibold text-slate-900">{candidate.votes} votes</span>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </section>
  )
}

export default function ResultsPage() {
  const { candidates, votes, students, loading, error } = useElectionData()

  const results = useMemo(() => computeResults(candidates, votes), [candidates, votes])
  const votesCast = Object.keys(votes).length
  const turnout = students.length ? Math.round((votesCast / students.length) * 100) : 0

  if (loading) return <div className="text-center text-slate-600">Loading results...</div>

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Could not load results: {error}
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 text-left">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Election Results</h1>
        <p className="mt-2 text-sm text-slate-600">
          Live results overview with charts and leaderboard.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-600">Students</div>
          <div className="text-2xl font-semibold text-slate-900">{students.length}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-600">Votes cast</div>
          <div className="text-2xl font-semibold text-slate-900">{votesCast}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-600">Turnout</div>
          <div className="text-2xl font-semibold text-slate-900">{turnout}%</div>
        </div>
      </section>

      <SectionCharts title="Head Boy" data={results["Head Boy"] || []} />
      <SectionCharts title="Head Girl" data={results["Head Girl"] || []} />
    </div>
  )
}
