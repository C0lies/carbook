import { rateLimit } from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per minute
    message: {
        message:
            'Too many login attempts, please try again after one minute :)',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default loginLimiter;
