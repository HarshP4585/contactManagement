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
   cd contactManagement
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

## Screenshots

### Home page
<img width="1470" height="878" alt="image" src="https://github.com/user-attachments/assets/febed13f-987c-48c8-87f0-3a5cc95151ff" />

### Admin home page
<img width="2940" height="1758" alt="image" src="https://github.com/user-attachments/assets/dd8be4ec-364c-4b02-a689-e7f52c7fe11d" />

### User home page
<img width="1470" height="877" alt="image" src="https://github.com/user-attachments/assets/7b447678-2487-4495-b3a5-99ddb38f8350" />

### Theme toggle
<img width="1470" height="877" alt="image" src="https://github.com/user-attachments/assets/dc9bafa1-92a0-4215-85d6-0e4d9e4938d0" />

### Contact added email
<img width="2156" height="1308" alt="image" src="https://github.com/user-attachments/assets/8849f72a-c190-4217-9d18-c7e64693b6d1" />

