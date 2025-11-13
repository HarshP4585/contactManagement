import { Router } from 'express';
import { ContactsController } from '../controllers/contacts.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// All contact routes require authentication
router.use(AuthMiddleware.authenticate);

router.post('/', ContactsController.createContact);
router.get('/', ContactsController.getAllContacts);
router.get('/:id', ContactsController.getContactById);
router.put('/:id', ContactsController.updateContact);
router.delete('/:id', ContactsController.deleteContact);

export default router;
