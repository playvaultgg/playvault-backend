# Deploy PlayVault to Railway

Your repo uses **`backend/`** and **`frontend/`** (not `server/` or `client/`).

- **backend/** → Node/Express API  
- **frontend/** → Vite/React app (builds to `frontend/dist`)

---

## 1. GitHub

Repo: https://github.com/playvaultgg/playvalut.git — already set up.

## 2. MongoDB Atlas

- Create a **free M0 cluster**
- Create a **database user**, note username/password
- **Network access** → Add IP → **Allow access from anywhere** `0.0.0.0/0`
- **Connect** → Drivers → copy connection string, e.g.  
  `mongodb+srv://USER:PASSWORD@cluster.mongodb.net/playvault`

## 3. Railway

- **New Project** → **Deploy from GitHub repo** → select **playvaultgg/playvalut**
- If your repo root is **GameStore** (so you see `backend/` and `frontend/` at root): leave **Root Directory** empty.
- If your repo root is **H1** (so you see `GameStore/backend` and `GameStore/frontend`): set **Root Directory** to **`GameStore`**.

## 4. Build & start (exact commands)

In Railway → your service → **Settings**:

| Setting | Value |
|--------|--------|
| **Install Command** | `cd backend && npm install && cd ../frontend && npm install` |
| **Build Command** | `cd frontend && npm run build` |
| **Start Command** | `cd backend && npm start` |

(If Root Directory is `GameStore`, these paths are correct. If repo root is already the folder that contains `backend/` and `frontend/`, use the same commands.)

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
