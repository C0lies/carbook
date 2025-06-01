/* eslint-disable prettier/prettier */

import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import express from 'express';

import verifyJWT from '../middleware/verifyJWT';
import { User } from '../models';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ error: 'Email and password are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password.length < 6) {
        return res
            .status(400)
            .json({ error: 'Password must be at least 6 characters long' });
    }
    if (role && !['user', 'admin'].includes(role)) {
        return res
            .status(400)
            .json({ error: 'Role must be either "user" or "admin"' });
    }
    if (role === 'admin' && req.user?.role !== 'admin') {
        return res
            .status(403)
            .json({ error: 'Only admin users can assign admin role' });
    }
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email is already taken' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
            role: role || 'user',
        });
        res.status(201).json({
            message: 'User created successfully',
            userId: user.id,
        });
    } catch (error) {
        console.error('Błąd tworzenia użytkownika:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.use(verifyJWT);

// GET /users/me - dane aktualnie zalogowanego użytkownika
router.get('/me', async (req, res) => {
    if (!req.user || typeof req.user.id !== 'number') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
    }
});
// READ ALL
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// READ ONE
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// UPDATE
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { email, password, role } = req.body;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const isAdmin = req.user?.role === 'admin';
        const isSelf = req.user?.id == id;
        if (!isAdmin && !isSelf) {
            return res.status(403).json({ error: 'Access denied' });
        }
        if (role && !isAdmin) {
            return res
                .status(403)
                .json({ error: 'Only admin can change role' });
        }
        if (email && typeof email !== 'string') {
            return res.status(400).json({ error: 'Invalid email' });
        }
        if (password && password.length < 6) {
            return res
                .status(400)
                .json({ error: 'Password must be at least 6 characters' });
        }
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (role && isAdmin) user.role = role;
        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Update failed' });
    }
});
// DELETE
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const isAdmin = req.user?.role === 'admin';
        const isSelf = req.user?.id == id;
        if (!isAdmin && !isSelf) {
            return res.status(403).json({ error: 'Access denied' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Deletion failed' });
    }
});

export default router;
