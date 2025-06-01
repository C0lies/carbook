import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const foundUser = await User.findOne({ where: { email } });
        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) return res.status(401).json({ message: 'Unauthorized' });
        const accessToken = jwt.sign(
            {
                id: foundUser.id,
                email: foundUser.email,
                role: foundUser.role,
            },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '30m' },
        );
        const refreshToken = jwt.sign(
            { id: foundUser.id, email: foundUser.email },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '1d' },
        );
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies.jwt) return res.status(401).json({ message: 'Unauthorized' });
    const refreshToken = cookies.jwt;
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: any, decoded: any) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });
            try {
                const foundUser = await User.findOne({
                    where: { email: decoded.email },
                });
                if (!foundUser)
                    return res.status(401).json({ message: 'Unauthorized' });
                const accessToken = jwt.sign(
                    {
                        id: foundUser.id,
                        email: foundUser.email,
                        role: foundUser.role,
                    },
                    process.env.ACCESS_TOKEN_SECRET!,
                    { expiresIn: '30m' },
                );
                res.json({ accessToken });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        },
    );
};

export const logout = (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies.jwt) return res.sendStatus(204);
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
    res.json({ message: 'Cookie cleared' });
};
