import React from "react";

const StatsCard = ({ title, value }) => {
  return (
    <div className="rounded-xl bg-white p-4 shadow sm:p-5">
      <h4 className="text-sm font-medium text-secondary sm:text-base">{title}</h4>
      <p className="mt-2 text-xl font-bold tabular-nums sm:text-2xl">{value}</p>
    </div>
  )
}

export default StatsCard;
