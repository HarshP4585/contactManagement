import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', AuthMiddleware.optionalAuth, AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.get('/profile', AuthMiddleware.authenticate, AuthController.getProfile);

export default router;
