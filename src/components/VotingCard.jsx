import React from "react"
import { Link } from "react-router-dom"

const VotingCard = () => {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow sm:p-6 md:flex-row md:items-center md:justify-between md:gap-6">
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold text-primary sm:text-xl">Student Leadership 2026</h3>
        <p className="mt-1 text-sm text-secondary sm:text-base">
          Participate in your school leadership election
        </p>

        <Link
          to="/voting"
          className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:opacity-95 sm:text-base"
        >
          Vote Now
        </Link>
      </div>
{/* 
      <div className="shrink-0 text-lg font-bold text-primary md:text-right">04:12:34</div> */}
    </div>
  )
}

export default VotingCard
