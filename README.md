# 📝 Notes API

A RESTful Notes API built with **Node.js**, **Express.js**, and **PostgreSQL**. Features JWT-based authentication, bcrypt password hashing, full CRUD on notes with pagination & search, and input validation middleware.

## 🚀 Features

- User registration & login with **bcrypt** password hashing
- **JWT** authentication (1h expiry)
- Full **CRUD** for notes (Create, Read, Update, Delete)
- **PUT** for full updates, **PATCH** for partial updates
- Pagination (`?page=1&limit=5`) and keyword **search** (`?search=keyword`)
- Input validation & whitelist middleware
- EJS templating for server-side rendered views
- PostgreSQL connection pooling via `pg`

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| Express.js v5 | Web framework |
| PostgreSQL | Database |
| `pg` | PostgreSQL client + connection pool |
| `bcrypt` | Password hashing |
| `jsonwebtoken` | JWT auth tokens |
| `ejs` | Server-side templating |
| `dotenv` | Environment variable management |

## 📁 Project Structure

```
backend/
├── app.js              # Entry point — middleware, routers, error handling
├── routes/
│   ├── auth.js         # POST /auth/register, POST /auth/login
│   └── notes.js        # GET/POST/PUT/PATCH/DELETE /notes
├── middleware/
│   ├── auth.js         # JWT authentication middleware
│   └── validation.js   # Input validation & sanitization
├── db/
│   └── pool.js         # PostgreSQL connection pool
├── views/              # EJS templates
├── public/             # Static assets
└── .env.example        # Environment variable template
```

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials and a strong JWT secret.

### 4. Set up the database

Run the following SQL in your PostgreSQL instance:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```

### 5. Start the server

```bash
node app.js
```

Server runs on `http://localhost:3000`.

## 📡 API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and receive JWT | No |

### Notes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/notes` | Get all notes (paginated) | Yes |
| GET | `/notes?search=keyword` | Search notes | Yes |
| GET | `/notes/:id` | Get a single note | Yes |
| POST | `/notes` | Create a note | Yes |
| PUT | `/notes/:id` | Fully replace a note | Yes |
| PATCH | `/notes/:id` | Partially update a note | Yes |
| DELETE | `/notes/:id` | Delete a note | Yes |

### Authentication Header

```
Authorization: Bearer <your_jwt_token>
```

## 🔒 Security

- Passwords are hashed with **bcrypt** (salt rounds: 10)
- JWT tokens expire in **1 hour**
- SQL injection prevented via **parameterized queries**
- Mass assignment prevented via **field whitelisting**
- Uniform error messages to prevent account enumeration
