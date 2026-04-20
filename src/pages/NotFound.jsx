import React from "react"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-lg text-center md:text-left">
      <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Page not found</h1>
      <p className="mt-2 text-gray-600">That URL does not exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-white hover:opacity-95"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
