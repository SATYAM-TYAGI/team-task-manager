# Railway deploy — super simple steps

Think of Railway like a **computer in the cloud** that runs your app.  
You need **3 boxes**:

1. **MongoDB** — where data is saved (like a notebook).
2. **Backend** — your Express API (the brain).
3. **Frontend** — your React website (what people see).

---

## Step 0 — Put code on GitHub first

Railway usually pulls from GitHub.

1. Make a repo on GitHub.
2. Push this whole folder (backend + frontend together is OK).

---

## Step 1 — MongoDB (pick ONE way)

### Way A — MongoDB Atlas (free, easy)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Make a free cluster.
3. Create a database user (username + password). **Save the password.**
4. **Network Access** → add IP `0.0.0.0/0` (means “allow from anywhere” — ok for school projects).
5. Click **Connect** → **Drivers** → copy the connection string.
6. Replace `<password>` with your real password (if password has special chars, you may need to “URL encode” it).
7. That long string is your **`MONGO_URL`**. You will paste it in Railway later.

### Way B — MongoDB on Railway

1. In your Railway project, click **+ New** → **Database** → **MongoDB**.
2. Railway gives you a **`MONGO_URL`** automatically (or similar). Copy it from the database service **Variables** tab.

---

## Step 2 — Deploy BACKEND on Railway

1. Go to [Railway](https://railway.app) → login.
2. **New Project** → **Deploy from GitHub** → pick your repo.
3. Railway might auto-detect wrong folder — **fix it**:
   - Open the **backend** service → **Settings**.
   - **Root Directory** = `backend`  (important!)
4. **Variables** (environment variables), add:
   - `MONGO_URL` = your Mongo connection string from Step 1
   - `JWT_SECRET` = any long random text (example: `my_super_secret_key_12345`)
5. **Settings → Deploy**:
   - **Build Command**: `npm install` (or leave empty if Railway auto-detects)
   - **Start Command**: `npm start`
6. Wait until deploy is green.
7. **Settings → Networking → Generate Domain** (public URL).
8. Copy that URL — example: `https://something.up.railway.app`  
   This is your **BACKEND URL**.  
   Test in browser: open it → you should see JSON like `Team Task Manager API running`.

If it crashes, open **Deployments → View Logs**.  
Common fixes:

- `MONGO_URL is missing` → you forgot Variables.
- Mongo timeout → wrong password, or Atlas IP not `0.0.0.0/0`.

---

## Step 3 — Deploy FRONTEND on Railway

1. In the **same Railway project**, click **+ New** → **GitHub Repo** → same repo again.
2. **Settings → Root Directory** = `frontend`
3. **Variables** — add **before** build (very important for Vite):

   `VITE_API_URL` = your **BACKEND URL** with **no** slash at the end  

   Good: `https://something.up.railway.app`  
   Bad: `https://something.up.railway.app/`

4. **Settings → Deploy**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`  
     (this project uses `serve` + `start-prod.cjs` so Railway `PORT` works)
5. **Generate Domain** for frontend.
6. Open frontend URL in browser → try signup/login.

If frontend loads but API errors / “failed to fetch”:

- Check `VITE_API_URL` is exactly the backend Railway URL (https).
- After changing `VITE_API_URL`, you must **redeploy** frontend (new build), because Vite bakes this value at build time.

---

## Step 4 — Order checklist (don’t skip)

1. Backend deploy works → open backend URL → see JSON.
2. Then set frontend `VITE_API_URL` to that backend URL.
3. Then build + deploy frontend again.

---

## Tiny memory trick

- **Backend** = kitchen (cooks data, talks to Mongo).
- **Frontend** = waiter (shows menu to user).
- **Mongo** = fridge (stores ingredients).

The waiter must know the kitchen address → that is **`VITE_API_URL`**.
