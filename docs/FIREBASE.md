# Firebase Realtime Database setup

## 1. Create / open the project

In [Firebase Console](https://console.firebase.google.com/), open your project (or create one).

## 2. Enable Realtime Database

1. **Build** → **Realtime Database** → **Create database**
2. Choose a location (region). For development you can start in **test mode** (open rules); **lock down rules before production** (see below).

## 3. Get the database URL

On the **Data** tab, copy the URL at the top. It looks like:

- `https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com`, or  
- `https://YOUR_PROJECT_ID-default-rtdb.REGION.firebasedatabase.app`

Paste it into `.env` as `VITE_FIREBASE_DATABASE_URL`.

## 4. Web app config

1. **Project settings** (gear) → **Your apps** → if you don’t have a web app, **Add app** → **Web** (`</>`)
2. Copy **apiKey**, **authDomain**, **projectId**, **storageBucket**, **messagingSenderId**, **appId** into `.env` using the names in `.env.example`.

## 5. Env file in this repo

```bash
cd voting
cp .env.example .env
# Edit .env and paste your values
```

Restart `npm run dev` after changing `.env`.

Only variables prefixed with `VITE_` are exposed to the browser (Vite requirement).

## 6. Security rules (important)

**Test mode** (example — anyone can read/write):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

For real use, replace with **Firebase Authentication** and rules that only allow writes you trust, for example:

```json
{
  "rules": {
    "election": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

Adjust to your product (e.g. admin-only writes).

## 7. Data shape in the DB

The app reads/writes under **`election/`**:

| Path | Content |
|------|--------|
| `election/students` | Object keyed by student id: `{ id, name }` |
| `election/candidates` | Object keyed by candidate id: `{ id, name, position, photo }` |
| `election/votes` | Object keyed by student id: `{ headBoy, headGirl }` |

On first connect, if `election/students` is empty, the app **seeds** demo students and candidates (see `src/services/electionRealtime.js`).

## 8. No `.env`?

If `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_DATABASE_URL` are missing, the app **falls back to localStorage** in the browser (same behavior as before Firebase).
