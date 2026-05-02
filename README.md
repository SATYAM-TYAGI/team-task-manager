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


## Live Link

-> https://team-task-manager-production-28a8.up.railway.app
