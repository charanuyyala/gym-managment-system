# IronPulse Gym Management System

Full-stack starter: React + Vite frontend, Express backend, MongoDB database, JWT authentication, and separate Member / Gym Owner roles. Frontend and backend can be started together from the project root with one command.

## Requirements
- Node.js 20+ (LTS recommended)
- MongoDB installed and running locally, or a MongoDB Atlas database

## 1. Open the whole project
1. Extract the ZIP file.
2. In VS Code choose **File → Open Folder** and select the `IronPulseGymSystem` root folder (the folder that contains this `package.json`).
3. Open **Terminal → New Terminal**. Make sure the terminal is at the root `IronPulseGymSystem` folder, not inside `frontend` or `backend`.

## 2. Configure MongoDB once
Copy `backend/.env.example` to `backend/.env`.

PowerShell command from the project root:
```powershell
Copy-Item backend/.env.example backend/.env
```

Open `backend/.env` and set your values. For local MongoDB:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ironpulse_gym
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_ORIGIN=http://localhost:5173
```
If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string. Make sure the database service is running / Atlas network access is configured. Do not share or commit `.env`.

## 3. Install and run BOTH apps with one command
Run these commands in the root terminal:
```powershell
npm install
npm run dev
```
This starts both the backend and frontend together. Open **http://localhost:5173** in your browser. The backend runs on **http://localhost:5000**. Keep the terminal open while using the site; press `Ctrl+C` to stop both.

If PowerShell blocks `npm.ps1`, use:
```powershell
npm.cmd install
npm.cmd run dev
```

## 4. Roles
- Members can register with the Member role and view their membership dashboard.
- Gym Owners can register with the Owner role and view the gym overview.
- This starter allows selecting Owner during registration for local demo/testing. Before public deployment, make owner accounts invitation-only or manually approved.

## Troubleshooting
- If MongoDB connection fails, start your local MongoDB service or verify the Atlas URI and network access.
- If port 5173 or 5000 is already in use, stop the other app using that port or change its port configuration.
- If dependencies fail to install, check internet connectivity and run `npm.cmd install` from the root folder.

## Security notes
This is a learning starter, not production-ready. Before deploying publicly, add owner approval, email verification, password reset, stronger validation, secure HTTPS deployment, audit logs, and payment-provider integration. Never store card details yourself.
