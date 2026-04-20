import React from "react"
import CandidateCard from "./CandidateCard"

export default function VoteSection({ title, candidates = [], selectedId, onSelect }) {
  return (
    <section className="mb-5 min-w-0 sm:mb-6">
      <h2 className="mb-3 text-xl font-medium text-gray-900">{title}</h2>
      <div className="space-y-2">
        {candidates.length === 0 && (
          <div className="text-sm text-gray-500">No candidates</div>
        )}
        {candidates.map((c) => (
          <CandidateCard
            key={c.id}
            candidate={c}
            selected={selectedId === c.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
