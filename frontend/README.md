# Contact Management Frontend

A modern, responsive contact management application built with Next.js 14, TypeScript, and Tailwind CSS with automatic token refresh and role-based access control.

## Features

- User authentication (Login/Register) with JWT
- Automatic token refresh with HTTP-only cookies
- Create, Read, Update, Delete contacts
- Photo upload for contacts
- **Server-side search** with 2-second debouncing (searches name and email)
- **Pagination** with configurable items per page (default: 10)
- **Sorting** by name or created date (ascending/descending)
- Role-based access control (Admin/User)
- Admin user management interface
- Responsive design with Tailwind CSS
- Reusable component library
- Type-safe with TypeScript
- Modern UI with smooth animations
- Automatic request retry on token expiration
- CSV export functionality

## Tech Stack

- **Framework**: Next.js 14 (App Router with React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **UI Components**: Custom reusable components
- **Authentication**: JWT with automatic refresh token handling

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── auth/              # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── contacts/          # Contacts pages
│   │   ├── admin/             # Admin-only pages
│   │   │   └── users/        # User management
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Alert.tsx
│   │   │   └── Modal.tsx
│   │   ├── auth/             # Auth-related components
│   │   │   └── UserForm.tsx  # User creation form
│   │   ├── contacts/         # Contact-related components
│   │   │   ├── ContactCard.tsx
│   │   │   └── ContactForm.tsx
│   │   └── layout/           # Layout components
│   │       ├── Header.tsx
│   │       └── Layout.tsx
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/                  # Libraries and utilities
│   │   └── api/             # API services
│   │       ├── client.ts    # Axios client with interceptors
│   │       ├── auth.ts      # Auth API methods
│   │       └── contacts.ts  # Contacts API methods
│   └── types/               # TypeScript types
│       └── index.ts
├── public/                  # Static files
├── .env.local              # Environment variables (local dev)
├── Dockerfile              # Docker configuration
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

### Option 1: Docker (Recommended)

See the main project README for Docker Compose setup.

### Option 2: Local Development

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables:**

   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3002/api
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3001`

## Running the Application

### Development Mode
```bash
npm run dev
```
Starts the Next.js development server with hot reload at `http://localhost:3001`.

### Production Mode
```bash
npm run build
npm start
```
Builds and starts the production server.

### Linting
```bash
npm run lint
```
Runs ESLint to check code quality.

## Docker Deployment

The application is containerized and can be deployed using Docker:

```bash
# Build the Docker image
docker build -t contact-management-frontend --build-arg BACKEND_PORT=3002 .

# Run the container
docker run -p 3001:3001 --env-file .env contact-management-frontend
```

Or use Docker Compose from the project root:
```bash
docker-compose up
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Pages

### Public Pages
- `/` - Landing page with app overview
- `/auth/login` - Login page
- `/auth/register` - Registration page (creates regular users only)

### Protected Pages (Require Authentication)
- `/contacts` - Contacts list with:
  - Paginated table with sortable columns
  - Server-side search (2-second debounce)
  - Create/edit/delete functionality
  - Photo upload support
  - CSV export

### Admin-Only Pages (Require Admin Role)
- `/admin/users` - User management page for creating admin and regular users

## Key Features

### Pagination
- **Default**: 10 contacts per page
- **Configurable**: Can be changed in the code
- **Smart pagination controls**:
  - Mobile: Previous/Next buttons
  - Desktop: Page numbers with ellipsis (e.g., 1 2 3 ... 10)
- **Always visible footer**: Shows "Showing X to Y of Z results"
- **Integrated in table**: Pagination controls are part of the table component

### Search
- **Server-side search**: Queries backend API (not client-side filtering)
- **2-second debounce**: Waits 2 seconds after typing stops before searching
- **Visual feedback**:
  - Spinner while debouncing
  - "Searching..." text
- **Searches**: Name and email fields (case-insensitive)
- **Results**: Displays total results for search term
- **Clear button**: X icon to instantly clear search

### Sorting
- **Default**: Created date (newest first)
- **Sortable column**: Name (click header to toggle ASC/DESC)
- **Visual indicators**: Up/down arrows show current sort direction
- **Resets pagination**: Goes to page 1 when sort changes

## Components

### UI Components (Reusable)

#### Button
```tsx
<Button
  variant="primary"
  size="md"
  fullWidth
  loading={false}
  disabled={false}
>
  Click Me
</Button>
```
**Variants**: `primary`, `secondary`, `danger`, `outline`
**Sizes**: `sm`, `md`, `lg`

#### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error="Error message"
  helperText="Helper text"
  required
/>
```

#### Card
```tsx
<Card hover>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

#### Alert
```tsx
<Alert variant="success" onClose={() => {}}>
  Success message
</Alert>
```
**Variants**: `success`, `error`, `warning`, `info`

#### Modal
```tsx
<Modal isOpen={true} onClose={() => {}} title="Modal Title">
  Modal content
</Modal>
```

### Feature Components

#### ContactCard
Displays a contact with photo, details, and edit/delete actions.

#### ContactForm
Reusable form for creating and editing contacts with photo upload.

#### UserForm
Admin-only form for creating users with role selection.

#### Header
Application header with navigation, user info, and auth status.

#### Layout
Main layout wrapper with header and consistent styling.

## Authentication System

### How It Works

1. **Login/Register**: User provides credentials
2. **Token Received**: Backend returns:
   - Access token (stored in localStorage)
   - Refresh token (set as HTTP-only cookie)
3. **API Requests**: Access token sent in Authorization header
4. **Token Expiry**: When access token expires:
   - Axios interceptor catches 401 error
   - Automatically calls `/api/auth/refresh`
   - Gets new access token using refresh cookie
   - Retries failed request with new token
   - User never sees the error

### Token Storage

- **Access Token**: Stored in `localStorage` as `access_token`
- **Refresh Token**: Stored in HTTP-only cookie (prevents XSS)
- **User Data**: Stored in `localStorage` as `user` (JSON)

### AuthContext

Provides authentication state throughout the app:

```tsx
const {
  user,           // Current user object
  loading,        // Auth state loading
  login,          // Login function
  register,       // Register function
  logout,         // Logout function
  isAuthenticated // Boolean auth status
} = useAuth();
```

## User Roles & Permissions

### Default Admin Credentials

The backend creates a default admin user automatically:

**Email:** `admin@admin.com`
**Password:** `admin123`

⚠️ **Important:** Change this password immediately after first login!

### Role Comparison

| Feature | Admin (role_id: 1) | User (role_id: 2) |
|---------|-------------------|-------------------|
| View own contacts | ✅ | ✅ |
| View all contacts | ✅ | ❌ |
| Create contacts | ✅ | ✅ |
| Edit own contacts | ✅ | ✅ |
| Edit others' contacts | ❌ | ❌ |
| Delete own contacts | ✅ | ✅ |
| Delete others' contacts | ❌ | ❌ |
| Create users | ✅ | ❌ |
| Create admin users | ✅ | ❌ |
| Access admin pages | ✅ | ❌ |

### Admin Features

#### Visual Indicators
- **Admin Badge**: Displayed in the header next to user name
- **Admin Menu**: Special navigation item visible only to admins
- **Owner Labels**: Shows contact owner on cards when viewing others' contacts

#### Creating Admin Users

1. Login as an admin user
2. Navigate to **Admin** → **User Management** in the header
3. Click **Create New User**
4. Fill in user details:
   - First Name
   - Last Name
   - Email
   - Password
   - **Role**: Select "Admin" or "User"
5. Click **Create User**

#### Contact Management for Admins
- Admin users can **see all contacts** from all users
- Contact cards show *"Owner: [name]"* for others' contacts
- Edit/Delete buttons are **disabled** for contacts not owned by the admin
- Info alerts explain admin permissions clearly

## API Integration

### API Client (`lib/api/client.ts`)

The API client is built on Axios with automatic token refresh:

```typescript
// Automatically adds Authorization header
// Handles 401 errors and token refresh
// Retries failed requests after refresh
apiClient.get('/contacts')
apiClient.post('/contacts', data)
apiClient.put('/contacts/:id', data)
apiClient.delete('/contacts/:id')
```

### Authentication API (`lib/api/auth.ts`)

```typescript
// Public registration (creates regular users)
authApi.register(data)

// Admin-only registration (can set role_id)
authApi.registerWithRole({ ...data, role_id: 1 })

// Login
authApi.login(credentials)

// Get current user profile
authApi.getProfile()

// Refresh access token (automatic)
authApi.refreshToken()

// Logout
authApi.logout()

// Check if authenticated
authApi.isAuthenticated()

// Get stored user data
authApi.getCurrentUser()
```

### Contacts API (`lib/api/contacts.ts`)

```typescript
// Get all contacts with pagination, sorting, and search
contactsApi.getAll({
  page: 1,
  limit: 10,
  sortBy: 'created_at', // or 'name'
  order: 'DESC',        // or 'ASC'
  search: 'john'        // optional search term
})

// Get all contacts (with defaults)
contactsApi.getAll()

// Get single contact
contactsApi.getById(id)

// Create contact with photo
contactsApi.create(formData)

// Update contact
contactsApi.update(id, formData)

// Delete contact
contactsApi.delete(id)
```

**Pagination Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10, max: 100
- `sortBy` (optional): Sort field - `'created_at'` or `'name'`, default: `'created_at'`
- `order` (optional): Sort order - `'ASC'` or `'DESC'`, default: `'DESC'`
- `search` (optional): Search term for name/email filtering

## State Management

### AuthContext

Centralized authentication state using React Context API:

```tsx
// In your component
const { user, isAuthenticated, login, logout } = useAuth();

// Login
await login({ email, password });

// Register
await register({ first_name, last_name, email, password });

// Logout
logout();

// Check auth status
if (isAuthenticated) {
  // User is logged in
}
```

### Loading States

The AuthContext provides a `loading` state to prevent flickering:

```tsx
const { loading } = useAuth();

if (loading) {
  return <LoadingSpinner />;
}
```

## Styling Guidelines

### Design System

- **Primary Color**: Blue-600 (`#2563eb`)
- **Text Colors**:
  - Primary: Gray-900 (`#111827`)
  - Secondary: Gray-600 (`#4b5563`)
  - Muted: Gray-500 (`#6b7280`)
- **Spacing**: Consistent 4px increments (p-2, p-4, p-6, etc.)
- **Border Radius**: `rounded-lg` for cards, `rounded-md` for inputs
- **Shadows**: `shadow-md` for cards, `shadow-lg` on hover
- **Transitions**: `transition-all duration-200` for smooth animations

### Responsive Design

- **Mobile-first**: Design works on small screens first
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Grid Layouts**: Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## Development Workflow

### Adding a New Page

1. Create folder in `src/app/` (e.g., `src/app/settings/`)
2. Add `page.tsx`:
   ```tsx
   'use client';

   import { Layout } from '@/components/layout/Layout';

   export default function SettingsPage() {
     return (
       <Layout>
         <h1>Settings</h1>
       </Layout>
     );
   }
   ```
3. Add route protection if needed using `useAuth()`

### Creating a Reusable Component

1. Add to `src/components/ui/`
2. Use TypeScript for props:
   ```tsx
   interface ButtonProps {
     variant?: 'primary' | 'secondary';
     children: React.ReactNode;
   }

   export const Button = ({ variant = 'primary', children }: ButtonProps) => {
     // Component code
   }
   ```
3. Export from `src/components/ui/index.ts`

### Adding API Integration

1. Add methods to appropriate file in `src/lib/api/`
2. Use `apiClient` for authenticated requests
3. Handle errors with try/catch
4. Update types in `src/types/index.ts`

Example:
```typescript
export const myApi = {
  async getData() {
    try {
      const response = await apiClient.get('/my-endpoint');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
};
```

## Next.js Features Used

### App Router
- File-based routing
- Server and Client Components
- Layouts and nested routes

### Client Components
Most components use `'use client'` directive because:
- They use hooks (useState, useEffect, useContext)
- They handle user interactions
- They access browser APIs (localStorage)

### Server Components
- `layout.tsx` (root layout) is a Server Component
- Provides metadata and global providers

### RSC (React Server Components)
If you see `_rsc` in network requests, this is normal:
- Next.js uses this for page navigation
- It fetches component updates during routing
- Your API requests don't include `_rsc`
- This is expected Next.js 14 behavior

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3002/api` |

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Common Issues & Solutions

### API Connection Issues

**Problem**: Can't connect to backend
**Solution**:
1. Check backend is running on correct port (3002)
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check CORS settings in backend
4. Make sure ports match in docker-compose.yml

### Authentication Issues

**Problem**: Token refresh not working
**Solution**:
1. Check cookies are enabled in browser
2. Verify `withCredentials: true` in API client
3. Check backend CORS allows credentials
4. Clear browser cookies and localStorage

### Photo Upload Issues

**Problem**: Photos not uploading
**Solution**:
1. Check file size (max 5MB)
2. Verify file type (JPEG, PNG, GIF only)
3. Check backend `/photos` directory permissions
4. Ensure FormData is being sent correctly

### _rsc Parameter in URLs

**Problem**: Seeing `?_rsc=xxxxx` in network tab
**Solution**: This is normal Next.js behavior for React Server Components navigation. It doesn't affect your API calls.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- **Image Optimization**: Next.js automatically optimizes images
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components load on demand
- **Caching**: Static assets cached by Next.js

## Security Features

- **XSS Protection**: Refresh tokens in HTTP-only cookies
- **CSRF Protection**: SameSite cookie attribute
- **Input Validation**: Form validation before submission
- **Type Safety**: TypeScript prevents runtime errors
- **Secure Storage**: Sensitive tokens not in localStorage
- **Auto Logout**: On token refresh failure

## Testing

### Manual Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] View contacts list
- [ ] Create new contact with photo
- [ ] Edit existing contact
- [ ] Delete contact
- [ ] Login as admin
- [ ] View all users' contacts
- [ ] Create admin user
- [ ] Logout and login again
- [ ] Verify token refresh (wait 1 hour)

## License

ISC
