/* eslint-disable prettier/prettier */
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload as JwtPayloadType } from 'jsonwebtoken';

import { User } from '../models';

dotenv.config();

type JwtPayload = {
    id: number;
    role: string;
    iat?: number;
    exp?: number;
};

export default async function verifyJWT(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
        !authHeader ||
        typeof authHeader !== 'string' ||
        !authHeader.startsWith('Bearer ')
    ) {
        return res
            .status(401)
            .json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!accessTokenSecret) {
            console.error(
                'ACCESS_TOKEN_SECRET is not defined in environment variables.',
            );
            return res
                .status(500)
                .json({ error: 'Internal server error: Token secret missing' });
        }
        const decoded = jwt.verify(
            token,
            accessTokenSecret,
        ) as JwtPayloadType as JwtPayload;
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res
                .status(401)
                .json({ error: 'Unauthorized: User not found' });
        }
        // @ts-ignore
        req.user = { id: user.id, role: user.role };
        next();
    } catch (err) {
        console.error('JWT verification failed:', err);
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
}
