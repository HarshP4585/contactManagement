# Contact Management Frontend

A modern, responsive contact management application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- User authentication (Login/Register)
- Create, Read, Update, Delete contacts
- Responsive design with Tailwind CSS
- Reusable component library
- Type-safe with TypeScript
- Modern UI with smooth animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: Custom reusable components

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
│   │       ├── client.ts
│   │       ├── auth.ts
│   │       └── contacts.ts
│   └── types/               # TypeScript types
│       └── index.ts
├── public/                  # Static files
├── .env.local              # Environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json

```

## Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables:**

   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Pages

### Public Pages
- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page (creates regular users only)

### Protected Pages (Require Authentication)
- `/contacts` - Contacts list with create/edit/delete functionality

### Admin-Only Pages (Require Admin Role)
- `/admin/users` - User management page for creating admin and regular users

## Components

### UI Components (Reusable)

#### Button
```tsx
<Button variant="primary" size="md" fullWidth loading={false}>
  Click Me
</Button>
```
Variants: `primary`, `secondary`, `danger`, `outline`
Sizes: `sm`, `md`, `lg`

#### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
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
Variants: `success`, `error`, `warning`, `info`

#### Modal
```tsx
<Modal isOpen={true} onClose={() => {}} title="Modal Title">
  Modal content
</Modal>
```

### Feature Components

#### ContactCard
Displays a contact with edit and delete actions

#### ContactForm
Reusable form for creating and editing contacts

#### Header
Application header with navigation and auth status

#### Layout
Main layout wrapper with header and footer

## Admin Features & RBAC

### Default Admin Credentials

The backend creates a default admin user automatically after running migrations:

**Email:** `admin@admin.com`
**Password:** `admin123`

⚠️ **Important:** Change this password immediately after first login!

### User Roles

The application has two roles with different permissions:

#### Admin Users (role_id: 1)
- ✅ Can view all contacts from all users
- ✅ Can create new admin users
- ✅ Can create regular users
- ✅ Can edit and delete their own contacts
- ❌ Cannot edit or delete other users' contacts
- 📋 See "Admin" badge in the header
- 🔗 Access to `/admin/users` page

#### Regular Users (role_id: 2)
- ✅ Can view only their own contacts
- ✅ Can create, edit, and delete their own contacts
- ❌ Cannot view other users' contacts
- ❌ Cannot access admin pages

### Creating Admin Users

1. Login as an admin user (use default credentials or existing admin account)
2. Navigate to **Admin** in the header
3. Click **Create New User**
4. Fill in the user details
5. Select **Admin** from the role dropdown
6. Click **Create User**

Public registration (without admin login) can only create regular users.

### UI Features for Admins

- **Admin Badge**: Displayed in the header for admin users
- **Admin Menu**: Special navigation item visible only to admins
- **Owner Information**: When viewing others' contacts, admin sees who owns them
- **Action Restrictions**: Edit/Delete buttons are hidden for contacts not owned by the user
- **Info Alerts**: Clear messaging about admin permissions

## API Integration

### Authentication
- `authApi.login(credentials)` - Login user
- `authApi.register(data)` - Register new user (public, creates regular users only)
- `authApi.registerWithRole(data)` - Create user with specific role (admin only)
- `authApi.logout()` - Logout user
- `authApi.getProfile()` - Get current user profile

### Contacts
- `contactsApi.getAll()` - Get all contacts
- `contactsApi.getById(id)` - Get contact by ID
- `contactsApi.create(data)` - Create new contact
- `contactsApi.update(id, data)` - Update contact
- `contactsApi.delete(id)` - Delete contact

## State Management

The app uses React Context API for global state:

### AuthContext
Provides authentication state and methods:
```tsx
const { user, loading, login, register, logout, isAuthenticated } = useAuth();
```

## Styling Guidelines

The app uses Tailwind CSS with a consistent design system:

- **Primary Color**: Blue (`blue-600`)
- **Text Colors**: Gray scale (`gray-700`, `gray-600`, `gray-500`)
- **Spacing**: Consistent padding and margins
- **Border Radius**: `rounded-lg` for cards and inputs
- **Shadows**: `shadow-md` for cards, `shadow-lg` on hover

## Development

### Adding a New Page
1. Create a new folder in `src/app/`
2. Add `page.tsx` file
3. Use the Layout component for consistent UI

### Creating a Reusable Component
1. Add component to appropriate folder in `src/components/`
2. Use TypeScript for props
3. Follow existing component patterns
4. Export from `index.ts` if in UI folder

### API Integration
1. Add new API methods in `src/lib/api/`
2. Use the apiClient for HTTP requests
3. Handle errors consistently
4. Update TypeScript types in `src/types/`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
