import { ref, onValue, set, update, get } from "firebase/database"
import { getFirebaseDatabase } from "./firebase"
import { DEFAULT_CANDIDATES, DEFAULT_STUDENTS } from "../data/electionDefaults"

const ROOT = "election"

function objectToList(obj) {
  if (!obj || typeof obj !== "object") return []
  return Object.values(obj)
}

function studentsFromSnapshot(val) {
  const list = objectToList(val)
  return list.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))
}

/**
 * @param {(data: { students: object[], candidates: object[], votes: Record<string, { headBoy: string|null, headGirl: string|null }> }) => void} callback
 * @returns {() => void} unsubscribe
 */
export function subscribeElection(callback) {
  const db = getFirebaseDatabase()
  if (!db) throw new Error("Database not initialized")

  const r = ref(db, ROOT)
  return onValue(r, (snap) => {
    const v = snap.val() || {}
    callback({
      students: studentsFromSnapshot(v.students),
      candidates: objectToList(v.candidates),
      votes:
        v.votes && typeof v.votes === "object"
          ? { ...v.votes }
          : {},
    })
  })
}

function toKeyedObject(rows) {
  const o = {}
  for (const row of rows) {
    o[row.id] = row
  }
  return o
}

/** Writes demo students + candidates if `students` node is missing (first run). */
export async function ensureElectionSeed() {
  const db = getFirebaseDatabase()
  if (!db) return

  const studentsRef = ref(db, `${ROOT}/students`)
  const snap = await get(studentsRef)
  if (snap.exists()) return

  await update(ref(db, ROOT), {
    students: toKeyedObject(DEFAULT_STUDENTS),
    candidates: toKeyedObject(DEFAULT_CANDIDATES),
    votes: {},
  })
}

/**
 * @param {{ name: string, position: string, photo: string }} fields
 */
export async function addCandidateToDb(fields) {
  const db = getFirebaseDatabase()
  if (!db) throw new Error("Database not initialized")

  const id = `c_${Date.now()}`
  const row = {
    id,
    name: fields.name,
    position: fields.position,
    photo: fields.photo || "",
  }
  await set(ref(db, `${ROOT}/candidates/${id}`), row)
}

/**
 * @param {string} studentId
 * @param {{ headBoy: string|null, headGirl: string|null }} selection
 */
export async function submitVoteToDb(studentId, selection) {
  const db = getFirebaseDatabase()
  if (!db) throw new Error("Database not initialized")

  await set(ref(db, `${ROOT}/votes/${studentId}`), selection)
}
