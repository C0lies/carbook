import express from 'express';

import authRouter from './auth';
import userRouter from './user';
import vehicleRouter from './vehicle';

export const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (_req, res) => {
    res.send('OK');
});
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/vehicles', vehicleRouter);

