# Contact Management API

A RESTful API built with NestJS, TypeORM, and PostgreSQL for managing contacts with authentication.

## Features

- User authentication (Register/Login) with JWT
- CRUD operations for contacts
- Role-based access control
- Raw SQL queries with TypeORM
- Database migrations
- Input validation
- Error handling

## Tech Stack

- **Framework**: NestJS with Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM (with raw SQL queries)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

## Project Structure

```
backend/
├── controllers/         # Request handlers
│   ├── auth.controller.ts
│   └── contacts.controller.ts
├── routes/             # API routes
│   ├── auth.routes.ts
│   ├── contacts.routes.ts
│   └── index.ts
├── utils/              # Database utilities (raw SQL)
│   ├── auth.utils.ts
│   ├── contacts.utils.ts
│   └── jwt.utils.ts
├── middlewares/        # Express middlewares
│   └── auth.middleware.ts
├── db/                 # Database configuration
│   ├── data-source.ts
│   └── migrations/     # Migration files (JavaScript)
│       ├── 1700000000000-CreateRoleTable.js
│       ├── 1700000000001-CreateUserTable.js
│       └── 1700000000002-CreateContactsTable.js
├── types/              # TypeScript types/interfaces
│   ├── entities.ts
│   └── dtos.ts
├── index.ts            # Application entry point
├── .env                # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up PostgreSQL database:**
   ```sql
   CREATE DATABASE contact_management;
   ```

3. **Configure environment variables:**

   Update the `.env` file with your database credentials:
   ```env
   PORT=3000
   NODE_ENV=development

   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=contact_management

   JWT_SECRET=your-secret-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   ```

4. **Start the application:**

   For development (migrations run automatically):
   ```bash
   npm run dev
   ```

   Or manually run migrations first:
   ```bash
   npm run migration:run
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
This command automatically runs migrations before starting the development server.

### Production Mode
```bash
npm run build
npm run migration:run  # Run migrations
npm start
```

The API will be available at `http://localhost:3000/api`

## Default Admin Credentials

After running migrations, a default admin user is automatically created:

**Email:** `admin@admin.com`
**Password:** `admin123`

⚠️ **IMPORTANT**: Please change this password immediately after your first login!

### User Roles

The system has two roles:
- **Admin (role_id: 1)**: Can view all contacts from all users, but can only edit/delete their own contacts. Can create admin users.
- **User (role_id: 2)**: Can only view, create, edit, and delete their own contacts.

### Creating Admin Users

Only existing admin users can create new admin users. To create an admin:

1. Login as an admin user (get the access token)
2. Send a POST request to `/api/auth/register` with the admin token and `role_id: 1`

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "first_name": "New",
    "last_name": "Admin",
    "email": "newadmin@example.com",
    "password": "password123",
    "role_id": 1
  }'
```

Public registration (without authentication) can only create regular users (role_id: 2).

## API Endpoints

### Authentication

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role_id": 2
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "role_id": 2
    }
  }
}
```

#### Get Profile (requires authentication)
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Contacts (All endpoints require authentication)

#### Create a contact
```http
POST /api/contacts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "photo": "https://example.com/photo.jpg"
}
```

#### Get all contacts
```http
GET /api/contacts
Authorization: Bearer <token>
```

#### Get a single contact
```http
GET /api/contacts/:id
Authorization: Bearer <token>
```

#### Update a contact
```http
PUT /api/contacts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "+1234567891"
}
```

#### Delete a contact
```http
DELETE /api/contacts/:id
Authorization: Bearer <token>
```

## Database Schema

### Role Table
```sql
- id: SERIAL PRIMARY KEY
- name: VARCHAR(50) UNIQUE
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### User Table
```sql
- id: SERIAL PRIMARY KEY
- first_name: VARCHAR(100)
- last_name: VARCHAR(100)
- email: VARCHAR(255) UNIQUE
- password: VARCHAR(255) (hashed)
- role_id: INTEGER (FK to role.id)
- is_active: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Contacts Table
```sql
- id: SERIAL PRIMARY KEY
- name: VARCHAR(255)
- email: VARCHAR(255)
- phone: VARCHAR(20)
- photo: TEXT (nullable)
- user_id: INTEGER (FK to user.id)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Request Flow

```
Client Request
    ↓
index.ts (Express App)
    ↓
routes/ (Route definitions)
    ↓
middlewares/ (Auth middleware if protected route)
    ↓
controllers/ (Request validation & response)
    ↓
utils/ (Raw SQL queries via TypeORM)
    ↓
PostgreSQL Database
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Security Features

- **Password hashing** with bcrypt (10 rounds)
- **JWT-based authentication** with token expiration
- **SQL injection protection** (parameterized queries)
- **Input validation** on all endpoints
- **CORS enabled** for cross-origin requests
- **Role-based access control (RBAC)**:
  - Admin users can view all contacts but can only modify their own
  - Regular users can only view and modify their own contacts
  - Only admins can create new admin users
  - Public registration creates regular users only
- **Ownership verification** on update and delete operations
- **HTTP 403 Forbidden** responses for unauthorized access attempts

## Scripts

- `npm run dev` - Run migrations and start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migration:run` - Run database migrations
- `npm run migration:revert` - Revert last migration

## Testing the API

You can test the API using tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

### Example cURL commands:

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create Contact:**
```bash
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890"
  }'
```

## License

ISC
