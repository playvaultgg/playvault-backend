# Terminal commands (PowerShell / Windows)

On **PowerShell**, use **`;`** instead of **`&&`** to run multiple commands.

---

### Run backend
```powershell
cd "C:\Users\gunde\OneDrive\Desktop\H1\GameStore\backend"
npm start
```

### Run frontend (dev)
```powershell
cd "C:\Users\gunde\OneDrive\Desktop\H1\GameStore\frontend"
npm run dev
```

### Run seeder (with Atlas)
```powershell
cd "C:\Users\gunde\OneDrive\Desktop\H1\GameStore\backend"
$env:MONGO_URI="mongodb+srv://USER:PASSWORD@cluster0.ag8pr25.mongodb.net/playvault?appName=Cluster0"
node seeder.js
```

### Git push from repo root
```powershell
cd "C:\Users\gunde\OneDrive\Desktop\H1"
git add .
git commit -m "your message"
git push origin main
```

**If you see:** `The token '&&' is not a valid statement separator`  
→ You are in PowerShell. Use **`;`** not **`&&`**, or run one command per line.
