// import { useState, useEffect, useCallback, useMemo } from "react"
// import { isFirebaseConfigured } from "../services/firebase"
// import {
//   subscribeElection,
//   ensureElectionSeed,
//   addCandidateToDb,
//   submitVoteToDb,
// } from "../services/electionRealtime"
// import { DEFAULT_CANDIDATES, DEFAULT_STUDENTS } from "../data/electionDefaults"

// const LS_STUDENTS = "ev_students"
// const LS_CANDIDATES = "ev_candidates"
// const LS_VOTES = "ev_votes"

// function readLocal(key, fallback) {
//   try {
//     const raw = localStorage.getItem(key)
//     return raw ? JSON.parse(raw) : fallback
//   } catch {
//     return fallback
//   }
// }

// function writeLocal(key, value) {
//   try {
//     localStorage.setItem(key, JSON.stringify(value))
//   } catch {
//     // ignore
//   }
// }

// /**
//  * Live election data: Firebase Realtime Database when env is set, otherwise localStorage + defaults.
//  */
// export function useElectionData() {
//   const firebaseMode = useMemo(() => isFirebaseConfigured(), [])

//   const [students, setStudents] = useState(() =>
//     firebaseMode ? [] : readLocal(LS_STUDENTS, DEFAULT_STUDENTS),
//   )
//   const [candidates, setCandidates] = useState(() =>
//     firebaseMode ? [] : readLocal(LS_CANDIDATES, DEFAULT_CANDIDATES),
//   )
//   const [votes, setVotes] = useState(() =>
//     firebaseMode ? {} : readLocal(LS_VOTES, {}),
//   )
//   const [loading, setLoading] = useState(() => firebaseMode)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     if (!firebaseMode) return

//     let unsub = () => {}
//     let cancelled = false

//     ;(async () => {
//       try {
//         await ensureElectionSeed()
//         if (cancelled) return
//         unsub = subscribeElection((data) => {
//           setStudents(data.students)
//           setCandidates(data.candidates)
//           setVotes(data.votes)
//           setLoading(false)
//           setError(null)
//         })
//       } catch (e) {
//         if (!cancelled) {
//           setError(e?.message || "Could not connect to Firebase")
//           setLoading(false)
//         }
//       }
//     })()

//     return () => {
//       cancelled = true
//       unsub()
//     }
//   }, [firebaseMode])

//   useEffect(() => {
//     if (firebaseMode || loading) return
//     writeLocal(LS_STUDENTS, students)
//   }, [firebaseMode, loading, students])

//   useEffect(() => {
//     if (firebaseMode || loading) return
//     writeLocal(LS_CANDIDATES, candidates)
//   }, [firebaseMode, loading, candidates])

//   useEffect(() => {
//     if (firebaseMode || loading) return
//     writeLocal(LS_VOTES, votes)
//   }, [firebaseMode, loading, votes])

//   const addCandidate = useCallback(
//     async (form) => {
//       const row = {
//         id: `c_${Date.now()}`,
//         name: form.name,
//         position: form.position,
//         photo: form.photo || "",
//       }
//       if (firebaseMode) {
//         await addCandidateToDb(form)
//         return
//       }
//       setCandidates((prev) => [...prev, row])
//     },
//     [firebaseMode],
//   )

//   const submitVote = useCallback(
//     async (studentId, selection) => {
//       if (firebaseMode) {
//         await submitVoteToDb(studentId, selection)
//         return
//       }
//       setVotes((v) => ({ ...v, [studentId]: selection }))
//     },
//     [firebaseMode],
//   )

//   return {
//     students,
//     candidates,
//     votes,
//     loading,
//     error,
//     addCandidate,
//     submitVote,
//     /** true when VITE_FIREBASE_* env is present — data syncs to Realtime Database */
//     usesFirebase: firebaseMode,
//   }
// }


import { useEffect, useState } from "react"
import { db } from "../services/firebase"
import {
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDocFromServer,
  onSnapshot,
} from "firebase/firestore"

export function useElectionData() {
  const [candidates, setCandidates] = useState([])
  const [votes, setVotes] = useState({})
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      // 🔹 Candidates (Realtime)
      const unsubCandidates = onSnapshot(
        collection(db, "candidates"),
        (snapshot) => {
          setCandidates(
            snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          )
        }
      )

      // 🔹 Votes (Realtime)
      const unsubVotes = onSnapshot(
        collection(db, "votes"),
        (snapshot) => {
          const voteData = {}
          snapshot.docs.forEach((d) => {
            voteData[d.id] = d.data()
          })
          setVotes(voteData)
        }
      )

      // 🔹 Students (Realtime)
      const unsubStudents = onSnapshot(
        collection(db, "students"),
        (snapshot) => {
          setStudents(
            snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          )
          setLoading(false)
        }
      )

      // 🔥 Cleanup (VERY IMPORTANT)
      return () => {
        unsubCandidates()
        unsubVotes()
        unsubStudents()
      }

    } catch (err) {
      console.error(err)
      setError(err.message)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Keep frontend status aligned with backend vote docs.
    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        isVoted: Boolean(votes[student.id]),
      })),
    )
  }, [votes])

  // 🔹 Add candidate
  async function addCandidate(data) {
    try {
      await addDoc(collection(db, "candidates"), data)
    } catch (err) {
      throw new Error("Failed to add candidate")
    }
  }

  // 🔹 Submit vote
  async function submitVote(studentId, voteData) {
    try {
      const voteRef = doc(db, "votes", studentId)
      const existingVote = await getDocFromServer(voteRef)
      if (existingVote.exists()) {
        throw new Error("This student has already voted")
      }

      await setDoc(voteRef, voteData)

      // Persist status on student record as well.
      try {
        await updateDoc(doc(db, "students", studentId), { isVoted: true })
      } catch {
        // Ignore if student status update fails; vote itself is already stored.
      }
    } catch (err) {
      throw new Error(err?.message || "Failed to submit vote")
    }
  }

  return {
    candidates,
    votes,
    students,
    loading,
    error,
    addCandidate,
    submitVote,
    usesFirebase: true,
  }
}