import { Router } from 'express';
import authRoutes from './auth.routes';
import contactsRoutes from './contacts.routes';

const router = Router();

// API root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Contact Management API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
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

// Mount routes
router.use('/auth', authRoutes);
router.use('/contacts', contactsRoutes);

// 404 handler for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

export default router;
