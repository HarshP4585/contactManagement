# Contact Management Application

A full-stack contact management system with authentication, pagination, search, and role-based access control.

## Features

- JWT authentication with refresh tokens
- Contact CRUD with photo upload
- Server-side search (name/email) with 2-second debounce
- Pagination and sorting
- Role-based access control (Admin/User)
- CSV export

## Quick Start

### Prerequisites

- Docker & Docker Compose

### Installation & Deployment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HarshP4585/contactManagement
   cd Shift_Technologies_Assessment_Contact_Management_App
   ```

2. **Configure environment variables:**

   Edit the `.env` file in the project root:
   ```env
   # Database
   DB_HOST=db
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_secure_password
   DB_DATABASE=contact_management

   # Ports
   BACKEND_PORT=3002
   FRONTEND_PORT=3001

   # JWT Secrets (generate strong secrets!)
   JWT_SECRET=your_jwt_secret_min_32_chars
   JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars

   # Email (optional)
   EMAIL_ID=noreply@yourdomain.com
   # Your password from: https://myaccount.google.com/apppasswords
   EMAIL_PASSWORD=your_app_password
   ```

3. **Deploy:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3002/api

5. **Default admin credentials:**
   - Email: `admin@admin.com`
   - Password: `admin123`

## Stopping the Application

```bash
docker-compose down
```

## Viewing Logs

```bash
docker-compose logs -f
```

## Documentation

- [Backend API Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
