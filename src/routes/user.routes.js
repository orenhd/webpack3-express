import express from 'express';

import * as user_controller from '../controllers/user.controller';

const router = express.Router();

// define routes

router.post('/signup', user_controller.user_signup);

router.post('/login', user_controller.user_login);

// route middleware to verify a token on all following user routes
router.use(user_controller.user_verify_token);

router.get('/:id', user_controller.user_get);
	
export default router;
	