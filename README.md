# Team Task Manager

This is simple full stack app for team task managing. I made it using with React + Node/Express + MongoDB.

## What this project does:
It's Users can signup and login with JWT auth.
It includes Role based things:
  -> admin create projects and tasks.
  -> member can see own tasks and update task status.
A Dashboard showing total, completed, pending, overdue tasks
I also made a basic project page for making project and adding users.

## The Project's Features:

-> Auth with hashed password (using bcrypt) in files auth.js
-> Role check middleware (admin/member) in file role.js
-> Project management in file project.js
-> Task management with due date and status in file Task.js

## My Folder setup:

-> `backend` -> This folder contains Express API + Mongo models
-> `frontend` -> This folder contains React app

## To Run this program in local:

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
```

In `.env` put:

```env
MONGO_URL=your_mongo_connection
JWT_SECRET=your_secret
PORT=5000
```

Then you run:

```bash
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

In frontend `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Then you should run:

```bash
npm run dev
```

## API routes

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/users` (admin)
- `GET/POST /projects`
- `PUT /projects/:id/members`
- `GET/POST /tasks`
- `PUT /tasks/:id/status`
- `PUT /tasks/:id`

## Railway deploy (simple way)

You can deploy backend and frontend as 2 services in Railway.

### Backend service

1. New Project -> Deploy from GitHub repo
2. Root Directory set to `backend`
3. Add env vars:
   - `MONGO_URL`
   - `JWT_SECRET`
   - `PORT` (optional)
4. Start command: `npm start`

### Frontend service

1. Add one more service from same repo
2. Root Directory set to `frontend`
3. Add env var:
   - `VITE_API_URL` = backend public URL from Railway
4. Build command: `npm run build`
5. Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`

## Live Link

- Frontend: (put your link here)
- Backend: (put your link here)

## Notes

- Code is kept basic for short deadline
- Some parts are simple and not super perfect, but works
