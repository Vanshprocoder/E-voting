import React from "react"

export default function CandidateCard({ candidate, selected, onSelect }) {
  return (
    <div
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onSelect(candidate.id)
              }
            }
          : undefined
      }
      onClick={() => onSelect && onSelect(candidate.id)}
      className={`flex w-full max-w-full cursor-pointer items-center gap-3 rounded-[10px] p-3 sm:gap-4 sm:p-4 ${
        selected
          ? "border-2 border-[var(--accent)] bg-[var(--accent-bg)]"
          : "border border-[var(--border)] bg-transparent"
      } ${onSelect ? "" : "cursor-default"}`}
    >
      <img
        src={
          candidate.photo ||
          `https://via.placeholder.com/80?text=${encodeURIComponent(candidate.name)}`
        }
        alt=""
        width={80}
        height={80}
        className="h-16 w-16 shrink-0 rounded-lg object-cover sm:h-20 sm:w-20"
      />
      <div className="min-w-0 flex-1 text-left">
        <div className="font-semibold text-[var(--text-h)]">{candidate.name}</div>
        <div className="text-sm text-[var(--text)]">{candidate.position}</div>
      </div>
    </div>
  )
}
