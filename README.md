# SocialPilot AI — Full Stack 🚀

A production-grade, full-stack social media agency dashboard powered by Groq (LLaMA 3.3) + Google Gemini AI.

---

## Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React 18, Vite, Axios                     |
| Backend   | Node.js, Express.js                       |
| Database  | MongoDB + Mongoose                        |
| Auth      | JWT (jsonwebtoken + bcryptjs)             |
| AI (fast) | Groq — LLaMA 3.3 70B Versatile            |
| AI (smart)| Google Gemini 1.5 Flash                   |
| Security  | Helmet, CORS, JWT middleware              |

---

## Features

### Agency Management
- **Clients** — Full CRUD, status tracking, retainer amounts, platform tags
- **Tasks** — Cross-client task tracking with one-click status toggle
- **Deliverables** — Progress tracking with +/- controls and deadline management
- **Scheduler** — Weekly calendar view + list view for scheduled posts
- **Analytics** — Real stats from DB + per-client breakdowns

### AI Tools (Groq primary → Gemini fallback)
- **Caption Writer** — 3 platform-specific captions with hashtags
- **Hashtag Generator** — 3 tiered sets (High/Mid/Niche reach), click to copy
- **Content Ideas** — 6 ideas with type badges, hooks, and descriptions
- **AI Strategy Consultant** — Actionable advice for client challenges
- **Content Calendar** — Full 2-week calendar via API endpoint

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key — https://console.groq.com/keys
- Google Gemini API key — https://aistudio.google.com/app/apikey

### 1. Install all dependencies
```bash
npm run install:all
```

### 2. Configure the server
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/socialpilot
JWT_SECRET=your_long_random_secret_here
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
```

### 3. Run both server and client
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

### 4. Register your account
Open the app, click "Sign Up", and create your account. Data is stored in your MongoDB.

---

## Project Structure

```
socialpilot-fullstack/
├── package.json              ← root: runs both with concurrently
│
├── server/
│   ├── index.js              ← Express entry point
│   ├── .env.example
│   ├── config/
│   │   ├── db.js             ← MongoDB connection
│   │   └── ai.js             ← Groq + Gemini with auto-fallback
│   ├── models/
│   │   ├── User.js
│   │   ├── Client.js
│   │   ├── Task.js
│   │   ├── Deliverable.js
│   │   └── ScheduledPost.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   ├── taskController.js
│   │   ├── deliverableController.js
│   │   ├── postController.js
│   │   └── aiController.js   ← captions, hashtags, ideas, insights, calendar
│   ├── routes/
│   │   ├── auth.js
│   │   ├── clients.js
│   │   ├── tasks.js
│   │   ├── deliverables.js
│   │   ├── posts.js
│   │   └── ai.js
│   └── middleware/
│       ├── auth.js           ← JWT protect middleware
│       └── errorHandler.js
│
└── client/
    ├── vite.config.js        ← proxies /api → localhost:5000
    ├── src/
    │   ├── App.jsx           ← auth gate + page routing
    │   ├── main.jsx
    │   ├── index.css
    │   ├── utils/
    │   │   ├── api.js        ← axios instance with JWT interceptor
    │   │   └── colors.js     ← design tokens
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── UI.jsx        ← Badge, Avatar, GlowCard, Modal, etc.
    │   │   └── Sidebar.jsx
    │   └── pages/
    │       ├── AuthPage.jsx
    │       ├── Dashboard.jsx
    │       ├── Clients.jsx
    │       ├── Tasks.jsx
    │       ├── Deliverables.jsx
    │       ├── Scheduler.jsx
    │       ├── Analytics.jsx
    │       ├── CaptionWriter.jsx
    │       ├── Hashtags.jsx
    │       ├── ContentIdeas.jsx
    │       └── AIInsights.jsx
```

---

## API Endpoints

### Auth
| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| POST   | /api/auth/register  | Register new user  |
| POST   | /api/auth/login     | Login              |
| GET    | /api/auth/me        | Get current user   |

### Clients (all protected)
| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| GET    | /api/clients        | Get all clients    |
| GET    | /api/clients/stats  | Dashboard stats    |
| POST   | /api/clients        | Create client      |
| PUT    | /api/clients/:id    | Update client      |
| DELETE | /api/clients/:id    | Delete client      |

### Tasks, Deliverables, Posts
Same CRUD pattern: GET / POST on `/:resource`, PUT / DELETE on `/:resource/:id`

### AI (all protected)
| Method | Endpoint              | Body                          |
|--------|-----------------------|-------------------------------|
| POST   | /api/ai/captions      | { topic, platform, tone }     |
| POST   | /api/ai/hashtags      | { niche }                     |
| POST   | /api/ai/ideas         | { industry, goal }            |
| POST   | /api/ai/insights      | { challenge }                 |
| POST   | /api/ai/calendar      | { clientName, industry, ... } |

---

## Deploying to Production

### Backend (Railway / Render / Fly.io)
1. Push the `server/` folder
2. Set environment variables (PORT, MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, GROQ_API_KEY)
3. Start command: `node index.js`

### Frontend (Vercel / Netlify)
1. Build: `cd client && npm run build`
2. Output: `client/dist/`
3. Set env: `VITE_API_URL=https://your-backend.railway.app`
4. Update `vite.config.js` proxy OR set `baseURL` in `utils/api.js`

### MongoDB Atlas (free cloud DB)
1. Create free cluster at mongodb.com/atlas
2. Get connection string
3. Replace `MONGODB_URI` in server `.env`

---

## License
MIT — Free to use for personal and commercial projects.
