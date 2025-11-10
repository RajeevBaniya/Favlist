# FavList

FavList for managing your favorite movies and TV shows Built with React, TypeScript, Express and MySQL.

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- shadcn/ui 

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- MySQL
- JWT authentication
- Zod validation

## Project Structure

```
favlist/
├── backend/          # Express API server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Auth, validation, error handling
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── db/             # Database client and seed data
│   │   └── utils/          # Utilities (JWT, logger, constants)
│   └── prisma/             # Database schema
│
└── frontend/         # React application
    ├── src/
    │   ├── api/            # API client
    │   ├── components/     # React components
    │   ├── contexts/       # React contexts (Auth)
    │   ├── hooks/          # Custom hooks
    │   ├── pages/          # Page components
    │   └── types/          # TypeScript types
    └── public/
```

## Features

- User authentication (signup, login, logout)
- CRUD operations for movie/TV show entries
- Search and filter entries by title, director, location, or type
- Infinite scroll pagination
- Responsive design with modern UI

## Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd favlist
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="mysql://user:password@localhost:3306/favlist"
JWT_SECRET="your-secret-key-here"
NODE_ENV="development"
PORT=4000
FRONTEND_URL="http://localhost:5173"
```

Generate Prisma Client and run migrations:

```bash
npm run db:generate
npm run db:push
```

(Optional) Seed the database with sample data:

```bash
npm run db:seed
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional):

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm start
```
Server runs on `http://localhost:4000`

**Frontend:**
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Entries
- `GET /api/entries` - Get paginated entries (supports `search`, `type`, `limit`, `pageToken` query params)
- `GET /api/entries/:id` - Get entry by ID
- `POST /api/entries` - Create new entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry
- `GET /api/entries/search?q=query` - Search entries

### Health
- `GET /api/health` - Health check endpoint

## Database Schema

- **User**: id, email, password, name, createdAt, updatedAt
- **Entry**: id, title, type (MOVIE/TV_SHOW), director, budget, location, duration, yearTime, posterUrl, userId, createdAt, updatedAt

## License

ISC

