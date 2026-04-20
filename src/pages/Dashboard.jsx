import React from "react"
import VotingCard from "../components/VotingCard"
import StatsCard from "../components/StatsCard"
import { useElectionData } from "../hooks/useElectionData"

const Dashboard = () => {
  const { students, votes, loading } = useElectionData()

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>
  }

  const totalStudents = students.length
  const votesCasted = Object.keys(votes).length
  const remaining = totalStudents - votesCasted

  return (
    <div className="w-full max-w-full space-y-6 text-left">
      <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
        Welcome back
      </h1>

      <VotingCard />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Students" value={totalStudents} />
        <StatsCard title="Votes Casted" value={votesCasted} />
        <StatsCard title="Remaining" value={remaining} />
      </div>
    </div>
  )
}

export default Dashboard