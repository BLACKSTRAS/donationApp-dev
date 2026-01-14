

import { Router  } from 'express';
import { registerUser,loginUser, logoutUser } from './authController';

const router =  Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
/* router.get('/', forgotPasswordUser);  */
export default router;