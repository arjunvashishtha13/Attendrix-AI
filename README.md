# Attendrix AI

**AI-Powered Attendance Platform** — SaaS-style attendance with role-based access, analytics, webcam AI marking, and exportable reports.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Tailwind CSS, Recharts, react-hot-toast |
| Backend | Node.js, Express (MVC), MongoDB, JWT |
| AI | Face embedding + confidence threshold (swap in PyTorch/FaceNet — see `docs/ml-resources.md`) |

## Prerequisites

- Node.js 18+
- MongoDB (local service or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Quick start

### 1. MongoDB

**Local (Windows):** Services → **MongoDB Server** → Start, or Admin PowerShell:

```powershell
Start-Service MongoDB
```

**Atlas:** Copy your connection string into `backend/.env`:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/attendrix
```

### 2. Backend (port 5000)

```powershell
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

Health check: http://localhost:5000/api/v1/health

### 3. Frontend (port 3001)

```powershell
cd ..
copy .env.example .env
npm install
npm start
```

Open http://localhost:3001

> API calls use `/api/v1` and the CRA proxy (`package.json` → `http://localhost:5000`). Restart the frontend after changing `.env`.

### Demo accounts (after `npm run seed`)

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Teacher | teacher | teacher123 |
| Student | student | student123 |

## Project structure

```
├── src/                 # React app (Attendrix AI UI)
├── public/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── scripts/seed.js
└── docs/
```

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/auth/register` | Register |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/analytics/dashboard` | Dashboard stats |
| POST | `/api/v1/attendance/webcam` | AI webcam attendance |
| GET | `/api/v1/export/:courseId/csv` | Export CSV |
| GET | `/api/v1/export/:courseId/pdf` | Export PDF |

## Environment

| File | Purpose |
|------|---------|
| `backend/.env` | `PORT`, `MONGODB_URI`, `JWT_SECRET`, SMTP, OAuth |
| `.env` | `PORT=3001`, `REACT_APP_API_URL=/api/v1` |

Never commit `.env` files (listed in `.gitignore`).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED 127.0.0.1:27017` | Start MongoDB or set Atlas `MONGODB_URI` |
| `Cannot reach Attendrix API` | Run `npm run dev` in `backend` (port 5000) |
| Register/login network error | Restart frontend after `.env` change; confirm backend health URL works |
| Port 3001 in use | Stop other apps or allow CRA to use another port (proxy still works) |

## ML integration

See `docs/ml-resources.md` and replace `backend/services/faceRecognitionService.js`.

---

© Attendrix AI
