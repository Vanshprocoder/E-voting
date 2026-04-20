import React, { useEffect, useMemo, useState } from "react"
import StudentSelector from "../components/StudentSelector"
import VoteSection from "../components/VoteSection"
import { useElectionData } from "../hooks/useElectionData"

export default function VotingPage() {
  const { students, candidates, votes, loading, error, submitVote } = useElectionData()

  const [selectedStudent, setSelectedStudent] = useState("")
  const [selection, setSelection] = useState({ headBoy: null, headGirl: null })
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  const headBoys = useMemo(
    () => candidates.filter((c) => c.position === "Head Boy"),
    [candidates],
  )
  const headGirls = useMemo(
    () => candidates.filter((c) => c.position === "Head Girl"),
    [candidates],
  )

  useEffect(() => {
    if (selectedStudent && votes[selectedStudent]) {
      setTimeout(() => {
        setSubmitted(true)
        setSelection(votes[selectedStudent])
      }, 0)
    } else {
      setTimeout(() => {
        setSubmitted(false)
        setSelection({ headBoy: null, headGirl: null })
      }, 0)
    }
  }, [selectedStudent, votes])

  function handleSelect(position, id) {
    setSelection((s) => ({ ...s, [position]: id }))
  }

  async function handleSubmit() {
    if (!selectedStudent) return alert("Please select a student before voting")
    if (!selection.headBoy || !selection.headGirl)
      return alert("Please select one candidate per position")

    setSaving(true)
    try {
      await submitVote(selectedStudent, {
        headBoy: selection.headBoy,
        headGirl: selection.headGirl,
      })
      setSubmitted(true)
    } catch (e) {
      alert(e?.message || "Could not save vote")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center text-gray-600">
        Loading election data…
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 p-4 text-left text-red-800">
        <p className="font-medium">Firebase error</p>
        <p className="mt-1 text-sm">{error}</p>
        <p className="mt-2 text-sm text-red-700">
          Check your `.env` values and Realtime Database rules, then refresh.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl text-left">
      <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Voting Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600 sm:text-base">
        Choose your student identity and cast your vote.
      </p>

      <div className="mt-6">
        <StudentSelector
          students={students}
          value={selectedStudent}
          onChange={setSelectedStudent}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <VoteSection
          title="Head Boy"
          candidates={headBoys}
          selectedId={selection.headBoy}
          onSelect={(id) => handleSelect("headBoy", id)}
        />
        <VoteSection
          title="Head Girl"
          candidates={headGirls}
          selectedId={selection.headGirl}
          onSelect={(id) => handleSelect("headGirl", id)}
        />
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted || saving}
          className="w-full rounded-[10px] px-6 py-3 text-base font-medium transition-colors disabled:cursor-not-allowed sm:w-auto sm:px-8 sm:py-3.5"
          style={{
            border: "none",
            background: submitted ? "var(--border)" : "var(--accent)",
            color: submitted ? "var(--text)" : "white",
          }}
        >
          {submitted ? "Vote submitted" : saving ? "Saving…" : "Submit Vote"}
        </button>
      </div>
    </div>
  )
}
