import { Router } from 'express';
import { ContactsController } from '../controllers/contacts.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// All contact routes require authentication
router.use(AuthMiddleware.authenticate);

router.post('/', upload.single('photo'), ContactsController.createContact);
router.get('/', ContactsController.getAllContacts);
router.get('/:id', ContactsController.getContactById);
router.put('/:id', upload.single('photo'), ContactsController.updateContact);
router.delete('/:id', ContactsController.deleteContact);

export default router;
