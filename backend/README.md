# Contact Management API

A RESTful API built with Express, TypeORM, and PostgreSQL for managing contacts with JWT authentication and refresh tokens.

## Features

- User authentication (Register/Login) with JWT
- Refresh token mechanism with HTTP-only cookies
- CRUD operations for contacts
- Photo upload support with Multer
- Role-based access control (RBAC)
- Raw SQL queries with TypeORM
- Database migrations
- Input validation
- Error handling
- Docker deployment ready

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM (with raw SQL queries)
- **Authentication**: JWT (JSON Web Tokens) + Refresh Tokens
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **Email**: Nodemailer

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
│   ├── auth.middleware.ts
│   └── upload.middleware.ts
├── db/                 # Database configuration
│   ├── data-source.ts
│   └── migrations/     # Migration files (TypeScript)
│       ├── 1763019926834-CreateRoleTable.ts
│       ├── 1763019927871-CreateUserTable.ts
│       ├── 1763019928514-CreateContactsTable.ts
│       └── 1763019929752-CreateDefaultAdminUser.ts
├── types/              # TypeScript types/interfaces
│   ├── entities.ts
│   └── dtos.ts
├── photos/             # Uploaded contact photos
├── index.ts            # Application entry point
├── .env                # Environment variables
├── Dockerfile          # Docker configuration
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v16 or higher)
- npm or yarn

## Installation

### Option 1: Docker (Recommended)

See the main project README for Docker Compose setup.

### Option 2: Local Development

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

   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   BACKEND_PORT=3002

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5433
   DB_USERNAME=postgres
   DB_PASSWORD=test
   DB_DATABASE=contact_management

   # JWT Configuration
   JWT_SECRET=your-super-long-secret-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-long-refresh-secret-key-change-this-in-production

   # Email Configuration
   EMAIL_ID=no-reply@contact_management.com
   EMAIL_PASSWORD=your-app-password
   ```

4. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

5. **Run migrations and start the application:**
   ```bash
   npm start
   ```

   For development with hot reload:
   ```bash
   npm run dev
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
This command automatically runs migrations before starting the development server with hot reload.

### Production Mode
```bash
npm run build
npm start
```
The start script automatically runs migrations and then starts the server.

### Migration Scripts

- `npm run migration:run` - Run migrations (uses compiled JavaScript from dist/)
- `npm run migration:revert` - Revert last migration (uses compiled JavaScript from dist/)
- `npm run migration:run:dev` - Run migrations in dev mode (uses TypeScript directly)
- `npm run migration:revert:dev` - Revert migrations in dev mode (uses TypeScript directly)

The API will be available at `http://localhost:3002/api` (or the port specified in your `.env` file)

## Docker Deployment

The application is containerized and can be deployed using Docker:

```bash
# Build the Docker image
docker build -t contact-management-backend .

# Run the container
docker run -p 3002:3002 --env-file .env contact-management-backend
```

Or use Docker Compose from the project root:
```bash
docker-compose up
```

## Default Admin Credentials

After running migrations, a default admin user is automatically created:

**Email:** `admin@admin.com`
**Password:** `admin123`

⚠️ **IMPORTANT**: Please change this password immediately after your first login!

## Authentication System

### JWT Access Tokens
- Short-lived tokens (1 hour by default)
- Sent in Authorization header: `Bearer <token>`
- Used for authenticating API requests

### Refresh Tokens
- Long-lived tokens (7 days by default)
- Stored in HTTP-only cookies
- Used to obtain new access tokens
- Automatically sent with requests via cookies

### Refresh Flow
When an access token expires:
1. Frontend automatically calls `/api/auth/refresh`
2. Backend validates the refresh token from the cookie
3. If valid, a new access token is issued
4. Failed requests are automatically retried with the new token

## User Roles & Permissions

The system has two roles:

### Admin (role_id: 1)
- ✅ Can view all contacts from all users
- ✅ Can create admin and regular users
- ✅ Can edit/delete their own contacts
- ❌ Cannot edit/delete other users' contacts

### User (role_id: 2)
- ✅ Can view only their own contacts
- ✅ Can create, edit, and delete their own contacts
- ❌ Cannot view other users' contacts
- ❌ Cannot access admin endpoints

### Creating Admin Users

Only existing admin users can create new admin users:

1. Login as an admin user (get the access token)
2. Send a POST request to `/api/auth/register` with the admin token and `role_id: 1`

```bash
curl -X POST http://localhost:3002/api/auth/register \
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
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
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

A refresh token is automatically set as an HTTP-only cookie.

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

#### Refresh Access Token
```http
POST /api/auth/refresh
Cookie: refresh_token=<token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs..."
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
Content-Type: multipart/form-data

name: Jane Smith
email: jane@example.com
phone: +1234567890
photo: <file>
```

#### Get all contacts
```http
GET /api/contacts?page=1&limit=10&sortBy=created_at&order=DESC&search=john
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page, max 100 (default: 10)
- `sortBy` (optional): Field to sort by - `created_at`, `name` (default: `created_at`)
- `order` (optional): Sort order - `ASC`, `DESC` (default: `DESC`)
- `search` (optional): Search term to filter by name or email (case-insensitive)

**Examples:**
```http
# Get first page with default sorting
GET /api/contacts

# Get second page with 20 items per page
GET /api/contacts?page=2&limit=20

# Sort by name ascending
GET /api/contacts?sortBy=name&order=ASC

# Search for contacts containing "john"
GET /api/contacts?search=john

# Combined: Search and sort
GET /api/contacts?search=john&sortBy=name&order=ASC&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "message": "Contacts retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "photo": "data:image/jpeg;base64,...",
      "user_id": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

**Admin users**: Returns all contacts from all users (with owner information)
**Regular users**: Returns only their own contacts

#### Get a single contact
```http
GET /api/contacts/:id
Authorization: Bearer <token>
```

#### Update a contact
```http
PUT /api/contacts/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: Jane Doe
email: jane.doe@example.com
phone: +1234567891
photo: <file>
```

Note: Users can only update their own contacts.

#### Delete a contact
```http
DELETE /api/contacts/:id
Authorization: Bearer <token>
```

Note: Users can only delete their own contacts.

## Photo Upload

Contact photos are uploaded using Multer:
- Accepted formats: JPEG, PNG, GIF
- Max file size: 5MB
- Photos are stored in `/photos` directory
- Accessible via `/photos/<filename>`

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
- password: VARCHAR(255) (hashed with bcrypt)
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
- photo: TEXT (nullable, stores filename)
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
CORS Middleware
    ↓
routes/ (Route definitions)
    ↓
middlewares/ (Auth/Upload middleware if needed)
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

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- **Password hashing** with bcrypt (10 rounds)
- **JWT-based authentication** with access and refresh tokens
- **HTTP-only cookies** for refresh tokens (prevents XSS attacks)
- **SQL injection protection** (parameterized queries)
- **Input validation** on all endpoints
- **CORS enabled** with credential support
- **Role-based access control (RBAC)**:
  - Admin users can view all contacts but can only modify their own
  - Regular users can only view and modify their own contacts
  - Only admins can create new admin users
  - Public registration creates regular users only
- **Ownership verification** on update and delete operations
- **HTTP 403 Forbidden** responses for unauthorized access attempts
- **File upload restrictions** (type and size limits)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `BACKEND_PORT` | Server port | `3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `DB_DATABASE` | Database name | `contact_management` |
| `JWT_SECRET` | Access token secret | - |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `EMAIL_ID` | Email for notifications | - |
| `EMAIL_PASSWORD` | Email app password | - |

## Scripts

- `npm run dev` - Run migrations and start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run migrations and start production server
- `npm run migration:run` - Run database migrations (production)
- `npm run migration:revert` - Revert last migration (production)
- `npm run migration:run:dev` - Run migrations (development)
- `npm run migration:revert:dev` - Revert migrations (development)

## Testing the API

You can test the API using tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

### Example cURL commands:

**Register:**
```bash
curl -X POST http://localhost:3002/api/auth/register \
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
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create Contact:**
```bash
curl -X POST http://localhost:3002/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Jane Smith" \
  -F "email=jane@example.com" \
  -F "phone=+1234567890" \
  -F "photo=@/path/to/photo.jpg"
```

**Refresh Token:**
```bash
curl -X POST http://localhost:3002/api/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

## Troubleshooting

### Port Issues
If you get a port conflict error:
1. Check if port 3002 (or your configured port) is in use
2. Update `BACKEND_PORT` in `.env`
3. Make sure Docker Compose is using the correct port mapping

### Migration Issues
If migrations fail:
1. Ensure the database exists: `CREATE DATABASE contact_management;`
2. Check database credentials in `.env`
3. Build the project first: `npm run build`
4. Try running migrations manually: `npm run migration:run`

### TypeScript Configuration Issues
If you see errors about `tsconfig-paths` or path resolution:
1. Make sure `baseUrl` is set in `tsconfig.json`
2. Ensure dependencies are installed: `npm install`
3. Rebuild the project: `npm run build`

## License

ISC
