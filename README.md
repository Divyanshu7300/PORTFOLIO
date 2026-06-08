# PORTFOLIO

A full-stack personal portfolio project with a modern animated frontend and an Express + MongoDB backend.

The frontend is built with Next.js and Framer Motion, while the backend exposes APIs for projects and contact messages. If MongoDB is unavailable, the backend automatically falls back to in-memory/message-safe behavior and static project data so the portfolio can still run.

## Tech Stack

- Frontend: Next.js 15, React 19, Tailwind CSS 4, Framer Motion, Axios, Three.js
- Backend: Node.js, Express 5, MongoDB, Mongoose, CORS, dotenv
- Tooling: Biome, Nodemon

## Project Structure

```text
PORTFOLIO/
├── Frontend/          # Next.js app
│   ├── src/app/
│   └── public/
├── backend/           # Express API
│   └── src/
│       ├── data/
│       ├── lib/
│       ├── models/
│       └── routes/
└── README.md
```

## Features

- Animated single-page portfolio experience
- Section-based navigation for hero, about, skills, projects, and contact
- Custom cursor and Three.js particle background
- Projects fetched from backend API
- Contact form submission to backend API
- MongoDB-backed persistence for projects and contacts
- Fallback mode when database is offline

## Environment Variables

### Backend

Create `backend/.env` using `backend/.env.example` as reference:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
FRONTEND_URI=http://localhost:3000
HOST=0.0.0.0
```

### Frontend

Create `Frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Installation

Install dependencies separately for both apps:

```bash
cd Frontend
npm install
```

```bash
cd backend
npm install
```

## Run Locally

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd Frontend
npm run dev
```

Frontend runs on `http://localhost:3000` and backend runs on `http://localhost:5000`.

## Available Scripts

### Frontend

- `npm run dev` - start Next.js dev server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run Biome checks
- `npm run format` - format code with Biome

### Backend

- `npm run dev` - start backend with Nodemon
- `npm start` - start backend with Node

## API Endpoints

### `GET /`

Health text response for the backend server.

### `GET /health`

Returns backend health status.

### `GET /projects`

Returns all projects from MongoDB. If the database is unavailable or empty, fallback project data is returned.

### `POST /projects`

Creates a new project.

Expected payload:

```json
{
  "title": "Project title",
  "description": "Project description",
  "imageUrl": "https://example.com/image.png",
  "projectUrl": "https://example.com",
  "technologies": ["Next.js", "MongoDB"]
}
```

### `POST /connect`

Stores a contact form submission.

Expected payload:

```json
{
  "name": "Your name",
  "email": "you@example.com",
  "message": "Hello there"
}
```

## Notes

- The frontend depends on `NEXT_PUBLIC_API_URL` for API requests.
- If MongoDB is not connected, project reads still work through fallback data.
- Contact submissions in fallback mode are only kept temporarily in memory.
