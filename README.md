# Attendrix AI

**AI-Powered Attendance Platform** — modern SaaS for schools and universities with facial recognition, analytics, and role-based portals.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Tailwind CSS, Recharts, react-hot-toast |
| Backend | Node.js, Express (MVC), MongoDB, JWT |
| AI | Face embedding + confidence threshold (extensible to PyTorch/FaceNet) |

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

API: `http://localhost:3000/api/v1`

### 2. Frontend

```bash
# from project root
cp .env.example .env
npm install
npm start
```

App: `http://localhost:3001`

### Demo accounts (after seed)

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Teacher | teacher | teacher123 |
| Student | student | student123 |

## Features

- **Roles**: Admin, Teacher, Student with protected routes
- **Dashboard**: Attendance %, monthly trends, present/absent charts
- **AI attendance**: Webcam capture with confidence scoring
- **Exports**: CSV and PDF reports per course
- **Email reminders**: SMTP-configurable (queued when SMTP is off)
- **Profile**: Edit details + register face for recognition

## Project structure

```
attendrix-ai/
├── src/                    # React frontend
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── services/api.js
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── scripts/seed.js
└── public/
```

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/register` | Register |
| GET | `/api/v1/analytics/dashboard` | Dashboard stats |
| POST | `/api/v1/attendance/webcam` | AI webcam attendance |
| GET | `/api/v1/export/:courseId/csv` | Export CSV |

## Environment

See `backend/.env.example` for MongoDB, JWT, SMTP, OAuth, and face confidence threshold.

## ML integration

Replace `backend/services/faceRecognitionService.js` with your PyTorch/FaceNet pipeline. The API contract returns `{ matched, confidence, threshold, student }`.

---

© Attendrix AI — AI-Powered Attendance Platform
