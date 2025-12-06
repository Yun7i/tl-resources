import { Router } from 'express';
import { createUser } from '../controllers/userController';
import { login } from '../controllers/authController';
import { hello } from '../controllers/protectedController';
import { validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/auth';
import { createUserSchema } from '../../../shared/src/schemas/user';
import { loginSchema } from '../../../shared/src/schemas/auth';

const router = Router();

router.post('/users', validate(createUserSchema), createUser);
router.post('/auth/login', validate(loginSchema), login);
router.get('/protected/hello', authMiddleware, hello);

export default router;
