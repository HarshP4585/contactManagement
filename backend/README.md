# Contact Management API

RESTful API for contact management with JWT authentication and role-based access control.

## Features

- JWT authentication (access + refresh tokens)
- Contact CRUD operations
- Photo upload support
- Server-side search, pagination, and sorting
- Role-based access control (Admin/User)

## Tech Stack

- Express.js + TypeScript
- PostgreSQL + TypeORM (raw SQL queries)
- JWT + bcrypt
- Multer (file uploads)

## Installation

```bash
cd backend
npm install
npm run build
npm start
```

## Environment Variables

Create a `.env` file:

```env
NODE_ENV=production
BACKEND_PORT=3002

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=contact_management

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

EMAIL_ID=noreply@example.com
EMAIL_PASSWORD=your_email_password
```

## Default Admin

After running migrations, a default admin is created:

- Email: `admin@admin.com`
- Password: `admin123`

## API Endpoints

### Authentication

#### Register
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

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Cookie: refresh_token=<token>
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Contacts (Authentication Required)

#### Get All Contacts
```http
GET /api/contacts?page=1&limit=10&sortBy=created_at&order=DESC&search=john
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sortBy` - `created_at` or `name` (default: `created_at`)
- `order` - `ASC` or `DESC` (default: `DESC`)
- `search` - Search term for name/email

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### Get Single Contact
```http
GET /api/contacts/:id
Authorization: Bearer <token>
```

#### Create Contact
```http
POST /api/contacts
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: Jane Smith
email: jane@example.com
phone: +1234567890
photo: <file>
```

#### Update Contact
```http
PUT /api/contacts/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: Jane Doe
email: jane.doe@example.com
phone: +1234567891
photo: <file>
```

#### Delete Contact
```http
DELETE /api/contacts/:id
Authorization: Bearer <token>
```

## Permissions

### Regular Users (role_id: 2)
- View/create/edit/delete own contacts only

### Admin Users (role_id: 1)
- View all contacts from all users
- Can only edit/delete own contacts
- Can create admin users

## Database

### Run Migrations
```bash
npm run migration:run
```

### Revert Migration
```bash
npm run migration:revert
```

## License

ISC
