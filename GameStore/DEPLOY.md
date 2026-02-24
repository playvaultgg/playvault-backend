# Deploy PlayVault to Railway

Your repo uses **`backend/`** and **`frontend/`** inside **GameStore/**.

- **GameStore/backend/** → Node/Express API  
- **GameStore/frontend/** → Vite/React app (builds to `frontend/dist`)

Repo: **playvault-backend** (root = H1, so app lives in **GameStore/**).

---

## 1. GitHub

Repo: https://github.com/playvaultgg/playvault-backend — already set up.

## 2. MongoDB Atlas

- Create a **free M0 cluster**
- Create a **database user**, note username/password
- **Network access** → Add IP → **Allow access from anywhere** `0.0.0.0/0`
- **Connect** → Drivers → copy connection string, e.g.  
  `mongodb+srv://USER:PASSWORD@cluster.mongodb.net/playvault`

## 3. Railway – Root Directory (required)

Your repo root has `GameStore/`, `images/`, `README.md` — the Node app is inside **GameStore**.

- In Railway: open your service → **Settings** → **Source** (or **General**).
- Set **Root Directory** to: **`GameStore`**  
  (so Railpack sees `package.json`, `backend/`, `frontend/` and detects Node).

## 4. Build & start commands

In Railway → your service → **Settings** → **Build** / **Deploy**:

| Setting | Value |
|--------|--------|
| **Install Command** | `npm run install:all` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |

(Root `GameStore/package.json` runs: install backend + frontend deps, build frontend, start backend.)

## 5. Environment variables (Railway → Variables)

| Variable | Value |
|----------|--------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random secret (e.g. generate one) |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | (Optional) Your Railway app URL, e.g. `https://your-app.up.railway.app` — for CORS. If not set, backend allows `*`. |

## 6. Backend (already done in this project)

- Uses `process.env.PORT` (Railway sets this).
- In **production**, serves the frontend build from **`frontend/dist`** and handles SPA fallback.
- CORS: `origin: process.env.CLIENT_URL || '*'`.

## 7. Frontend (already done)

- API calls use **relative URLs** (`/api/...`) so production uses the same origin; no extra env needed on Railway.
- For **local dev** (frontend on Vite, backend on 5000), create **`frontend/.env`** with:  
  `VITE_API_URL=http://localhost:5000`

## 8. Generate domain

Railway → **Settings** → **Networking** → **Generate domain**  
→ e.g. `https://your-project.up.railway.app` (this is your live site).

## 9. After deploy – test

- `/` – Home  
- `/login`, `/signup`  
- `/admin` (admin login)  
- `/browse`, `/checkout`, `/contact`  
- Payment QR and contact form should work with the env vars above.

---

## Short checklist

- [ ] MongoDB Atlas cluster + user + `0.0.0.0/0` + connection string
- [ ] Railway: Install / Build / Start commands as in section 4
- [ ] Variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`
- [ ] Generate domain and test the URLs in section 9
