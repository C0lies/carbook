import express from 'express';

import * as authController from '../controllers/authController';
import loginLimiter from '../middleware/loginLimiter';

const router = express.Router();

router.route('/').post(loginLimiter, (req, res, next) => {
    Promise.resolve(authController.login(req, res)).catch(next);
});

router.route('/refresh').get((req, res, next) => {
    Promise.resolve(authController.refresh(req, res)).catch(next);
});

router.route('/logout').post((req, res, next) => {
    Promise.resolve(authController.logout(req, res)).catch(next);
});

export default router;
