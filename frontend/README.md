# Contact Management Frontend

Modern, responsive contact management application built with Next.js 14 and TypeScript.

## Features

- JWT authentication with automatic refresh
- Contact CRUD with photo upload
- Server-side search with 2-second debounce
- Pagination and sorting
- Role-based access control (Admin/User)
- CSV export
- Responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios with interceptors

## Installation

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

## Pages

- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/contacts` - Contacts list (protected)
- `/admin/users` - User management (admin only)

## Key Features

### Pagination
- Default: 10 items per page
- Integrated in table footer
- Smart page navigation with ellipsis

### Search
- Server-side search (not client-side)
- 2-second debounce
- Searches name and email fields
- Visual loading indicators

### Sorting
- Default: Created date (newest first)
- Click column header to toggle sort
- Visual sort indicators

## Default Admin

- Email: `admin@admin.com`
- Password: `admin123`

## Build for Production

```bash
npm run build
npm start
```

## License

ISC
