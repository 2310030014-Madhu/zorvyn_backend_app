# Finance Backend Server

A role-based Finance Management REST API built with Express and MongoDB.

This project provides:
- JWT authentication
- Role-based authorization (`viewer`, `analyst`, `admin`)
- User management (admin-only)
- Financial record CRUD
- Advanced dashboard analytics (summary, category totals, monthly/weekly trends, recent activity)

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- CORS
- Dotenv

## Project Structure

```text
.
├── server.js
├── package.json
└── src
    ├── app.js
    ├── config
    ├── controllers
    │   ├── auth_controller.js
    │   ├── dashboard_controller.js
    │   ├── record_controller.js
    │   └── user_controller.js
    ├── middleware
    │   ├── auth.js
    │   ├── authorize.js
    │   ├── jwt_middleware.js
    │   ├── role_middleware.js
    │   └── validate_record.js
    ├── models
    │   ├── record.js
    │   └── user.js
    ├── routes
    │   ├── auth_routes.js
    │   ├── dashboard_routes.js
    │   ├── record_routes.js
    │   └── user_routes.js
    ├── services
    └── utils
        └── asycn_handeler.js
```

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB database (local or cloud)

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance_db
JWT_SECRET=your_super_secret_key
```

### Variable Details

- `PORT`: API server port.
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key used to sign JWT tokens.

## Running the Project

### Start with Node

```bash
node server.js
```

### Start with Nodemon (recommended for development)

```bash
npx nodemon server.js
```

When startup is successful, you should see logs similar to:
- `DB Connected`
- `Server running on port <PORT>`

## API Base URL

```text
http://localhost:<PORT>/api
```

Example (if `PORT=5000`):

```text
http://localhost:5000/api
```

## Authentication & Authorization

### JWT Format

Send token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

### Roles

- `viewer`: Read-only records
- `analyst`: Read records + dashboard summary
- `admin`: Full access (users + records + dashboard)

## Data Models

### User

```json
{
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "role": "viewer | analyst | admin",
  "status": "active | inactive"
}
```

### Record

```json
{
  "amount": "number",
  "type": "income | expense",
  "category": "string",
  "date": "date",
  "description": "string",
  "createdBy": "ObjectId(User)"
}
```

## API Endpoints

### Auth Routes

### Register

- **POST** `/api/auth/register`
- Public route

Request body:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "123456",
  "role": "admin"
}
```

Response:
- `201 Created` with created user object

### Login

- **POST** `/api/auth/login`
- Public route

Request body:

```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "token": "<jwt-token>"
}
```

### User Routes (Admin Only)

### Get all users

- **GET** `/api/users`
- Required role: `admin`

Response:
- `200 OK` with users list (password excluded)

### Update user status

- **PATCH** `/api/users/:id/status`
- Required role: `admin`

Request body:

```json
{
  "status": "inactive"
}
```

Response:
- `200 OK` with updated user

### Record Routes

### Create record

- **POST** `/api/records`
- Required role: `admin`

Request body:

```json
{
  "amount": 2500,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-05",
  "description": "Monthly salary"
}
```

Validation rules:
- `amount`, `type`, `category`, `date` are required
- `amount` must be greater than 0

Response:
- `201 Created` with created record

### Get records

- **GET** `/api/records`
- Required roles: `viewer`, `analyst`, `admin`

Optional query params:
- `type` (`income` or `expense`)
- `category` (string)
- `startDate` (optional lower date bound)
- `endDate` (optional upper date bound)

Behavior:
- Records are returned sorted by `date` in descending order (latest first)

Examples:

```http
GET /api/records?type=expense
GET /api/records?category=Food
GET /api/records?startDate=2026-01-01&endDate=2026-03-31
GET /api/records?startDate=2026-01-01
GET /api/records?endDate=2026-03-31
```

Response:
- `200 OK` with filtered records array

### Update record

- **PUT** `/api/records/:id`
- Required role: `admin`

Request body:
- Any updatable record fields

Response:
- `200 OK` with updated record

### Delete record

- **DELETE** `/api/records/:id`
- Required role: `admin`

Response:

```json
{
  "message": "Deleted successfully"
}
```

### Dashboard Route

### Get financial summary

- **GET** `/api/dashboard/summary`
- Required roles: `analyst`, `admin`

Response:

```json
{
  "totalIncome": 10000,
  "totalExpense": 4500,
  "netBalance": 5500
}
```

### Get category summary

- **GET** `/api/dashboard/category-summary`
- Required roles: `analyst`, `admin`

Response:

```json
[
  { "_id": "Salary", "total": 20000 },
  { "_id": "Food", "total": 4200 }
]
```

Notes:
- Aggregates total amount by category
- Sorted by total descending

### Get monthly trends

- **GET** `/api/dashboard/monthly-trends`
- Required roles: `analyst`, `admin`

Response:

```json
[
  {
    "_id": { "year": 2026, "month": 1, "type": "income" },
    "total": 10000
  },
  {
    "_id": { "year": 2026, "month": 1, "type": "expense" },
    "total": 3500
  }
]
```

Notes:
- Groups totals by year, month, and record type

### Get weekly trends

- **GET** `/api/dashboard/weekly-trends`
- Required roles: `analyst`, `admin`

Response:

```json
[
  {
    "_id": { "year": 2026, "week": 14, "type": "income" },
    "total": 2500
  },
  {
    "_id": { "year": 2026, "week": 14, "type": "expense" },
    "total": 1300
  }
]
```

Notes:
- Groups totals by year, week number, and record type

### Get recent activity

- **GET** `/api/dashboard/recent`
- Required roles: `analyst`, `admin`

Response:
- `200 OK` with last 5 created records (sorted by `createdAt` descending)

## Access Matrix

| Endpoint | viewer | analyst | admin |
|---|---|---|---|
| `POST /api/auth/register` | Yes | Yes | Yes |
| `POST /api/auth/login` | Yes | Yes | Yes |
| `GET /api/users` | No | No | Yes |
| `PATCH /api/users/:id/status` | No | No | Yes |
| `POST /api/records` | No | No | Yes |
| `GET /api/records` | Yes | Yes | Yes |
| `PUT /api/records/:id` | No | No | Yes |
| `DELETE /api/records/:id` | No | No | Yes |
| `GET /api/dashboard/summary` | No | Yes | Yes |
| `GET /api/dashboard/category-summary` | No | Yes | Yes |
| `GET /api/dashboard/monthly-trends` | No | Yes | Yes |
| `GET /api/dashboard/weekly-trends` | No | Yes | Yes |
| `GET /api/dashboard/recent` | No | Yes | Yes |

## Common Error Responses

- `400 Bad Request`
  - `User not found`
  - `Invalid credentials`
  - `Missing required fields`
  - `Amount must be positive`
- `401 Unauthorized`
  - `Unauthorized` (token missing)
  - `Invalid token`
- `403 Forbidden`
  - `Forbidden` (role not allowed)
- `500 Internal Server Error`
  - `Server Error`

## Quick Test Flow (Postman/Insomnia)

1. Register admin user via `POST /api/auth/register`.
2. Login via `POST /api/auth/login`.
3. Copy JWT token.
4. Call protected endpoints with `Authorization: Bearer <token>`.

## Notes and Current Limitations
- `register` returns full created user object (includes hashed password). need to omit `password` in response.
- JWT token currently has no expiry (`expiresIn`) configured.


