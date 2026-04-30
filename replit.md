# OpportunityHub

A full-stack MERN platform for Indian students to discover competitive exams,
scholarships, olympiads, entrance tests and internships — with deadlines,
syllabus, resources, mini-quizzes and a dashboard.

Built as a 4th-semester capstone project, sticking strictly to the classic MERN
stack with `.jsx` files (no TypeScript on the frontend) and a sidebar dashboard
UI.

## Stack

- **Frontend**: React 19 + Vite, plain JSX, React Router v6, Axios, Tailwind v4, Recharts
- **Backend**: Node.js + Express, Pino logger
- **Database**: MongoDB Atlas via Mongoose
- **Auth**: JWT + bcryptjs
- **Charts**: Recharts (bar + pie)

## Artifacts

- `artifacts/api-server` (kind: api, mounted at `/api`)
- `artifacts/opportunity-hub` (kind: web, mounted at `/`)
- `artifacts/mockup-sandbox` (kind: design)

The shared proxy routes `/api/**` to the API server and everything else to the
React app.

## Frontend folder structure (as required by the project brief)

```
artifacts/opportunity-hub/src/
├── api/
│   ├── axios.js          # axios instance with JWT interceptor + 401 redirect
│   ├── authApi.js
│   ├── opportunityApi.js
│   └── quizApi.js
├── components/
│   ├── common/           # Button, Badge, Loader, SearchBar, OpportunityCard, ProtectedRoute
│   └── layout/           # Sidebar, Navbar, DashboardLayout
├── context/
│   └── AuthContext.jsx   # login / register / logout / me
├── pages/
│   ├── Landing.jsx
│   ├── auth/             # Login.jsx, Register.jsx
│   ├── dashboard/        # Dashboard.jsx
│   ├── opportunities/    # OpportunityList.jsx, OpportunityDetails.jsx, Saved.jsx
│   ├── profile/          # Profile.jsx
│   ├── quiz/             # Quiz.jsx
│   └── admin/            # AdminPanel.jsx, OpportunityForm.jsx
├── routes/
│   └── AppRoutes.jsx
├── utils/
│   ├── formatDate.js
│   └── categories.js
├── App.jsx
├── main.jsx
└── index.css
```

## Backend (api-server)

```
artifacts/api-server/src/
├── lib/
│   ├── db.ts             # mongoose connect using MONGODB_URI
│   ├── auth.ts           # signToken, verifyToken, hashPassword, comparePassword
│   └── logger.ts
├── middlewares/
│   └── auth.ts           # requireAuth, requireAdmin
├── models/
│   ├── User.ts           # name, email, password, role, educationLevel,
│   │                     # savedOpportunities, quizScores[], progress
│   └── Opportunity.ts    # title, category, level, description, eligibility,
│                         # deadline, officialLink, syllabus[], resources[{title,url}],
│                         # pyqs[{title,url}], quiz[{question,options,answer}]
├── routes/
│   ├── auth.ts           # POST /register, POST /login, GET /me
│   ├── opportunities.ts  # CRUD (admin protected)
│   ├── user.ts           # /user/save/:id (toggle), /user/saved, /user/progress, /user/dashboard, /user (admin list)
│   ├── quiz.ts           # GET /quiz/:opportunityId (no answers), POST /quiz/submit
│   ├── health.ts
│   └── index.ts
├── seed.ts               # 35 realistic opportunities + admin + demo student
├── app.ts
└── index.ts              # connectDB then app.listen(PORT)
```

## Demo accounts (created by seed)

- Admin:   `admin@opportunityhub.com` / `admin123`
- Student: `student@opportunityhub.com` / `student123`

## Theme

- Background: white / gray-50
- Primary: indigo-600 (#4F46E5)
- Accent: emerald-500 (#10B981)
- Rounded-2xl cards, soft shadows, sidebar dashboard

## Common commands

- Reseed the database: `pnpm --filter @workspace/api-server run seed`
- API health check: `curl localhost:80/api/healthz`

## Required secrets

- `MONGODB_URI` — MongoDB Atlas connection string (must include database name, e.g. `/opportunityhub`)
- `SESSION_SECRET` — used as JWT signing key

## Notes

- Frontend uses `/api` (relative) so it works in dev and after deploy via the shared proxy.
- The vite config requires `PORT` and `BASE_PATH` env vars (provided by the artifact runner).
- TypeScript checking is off for frontend `.jsx` files (`allowJs: true, checkJs: false`).
