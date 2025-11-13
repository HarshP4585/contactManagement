import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { initializeDatabase } from './db/data-source';
import routes from './routes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded photos as static files
app.use('/photos', express.static('photos'));

// CORS middleware - Allow credentials for cookie-based refresh tokens
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
});

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Mount API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Contact Management API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (requires auth)',
      },
      contacts: {
        create: 'POST /api/contacts (requires auth)',
        getAll: 'GET /api/contacts (requires auth)',
        getOne: 'GET /api/contacts/:id (requires auth)',
        update: 'PUT /api/contacts/:id (requires auth)',
        delete: 'DELETE /api/contacts/:id (requires auth)',
      },
    },
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
