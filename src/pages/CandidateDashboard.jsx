import React from "react"
import CandidateCard from "../components/CandidateCard"
import { useElectionData } from "../hooks/useElectionData"

export default function CandidateDashboard() {
  const { candidates, votes, loading, error } = useElectionData()

  const voteCounts = {}
  Object.values(votes).forEach((v) => {
    if (v.headBoy) voteCounts[v.headBoy] = (voteCounts[v.headBoy] || 0) + 1
    if (v.headGirl) voteCounts[v.headGirl] = (voteCounts[v.headGirl] || 0) + 1
  })

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
    <div className="mx-auto w-full max-w-4xl text-left">
      <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Candidate Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600 sm:text-base">
        Browse candidates and vote counts (live when using Firebase).
      </p>

      <div className="mt-8 space-y-4">
        {candidates.length === 0 && (
          <div className="text-gray-600">No candidates yet.</div>
        )}
        {candidates.map((c) => (
          <div
            key={c.id}
            className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm sm:flex-row sm:items-stretch sm:justify-between sm:p-4"
          >
            <div className="min-w-0 flex-1">
              <CandidateCard candidate={{ ...c }} />
            </div>
            <div className="flex shrink-0 flex-row items-center justify-between border-t border-gray-100 pt-3 sm:w-28 sm:flex-col sm:justify-center sm:border-l sm:border-t-0 sm:pt-0 sm:pl-4 sm:text-right">
              <div className="text-xs text-gray-500 sm:text-sm">Votes</div>
              <div className="text-lg font-semibold text-gray-900">
                {voteCounts[c.id] || 0}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
