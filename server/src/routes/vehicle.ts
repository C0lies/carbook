import fs from 'fs';
import path from 'path';

import express from 'express';

import verifyJWT from '../middleware/verifyJWT';
import { Vehicle } from '../models';

type VehicleRequestBody = {
    vin: string;
    brand: string;
    model: string;
    version?: string;
    engine?: string;
    first_registration?: string;
};

const router = express.Router();
router.use(verifyJWT);

// CREATE - Dodawanie pojazdu
router.post('/', async (req, res) => {
    const {
        vin,
        brand,
        model,
        version,
        engine,
        first_registration,
    }: VehicleRequestBody = req.body;
    const user_id = req.user.id;
    try {
        const count = await Vehicle.count({ where: { userId: user_id } });
        const newVehicle = await Vehicle.create({
            userId: user_id,
            custom_number: count + 1,
            vin,
            brand,
            model,
            version,
            engine,
            first_registration,
        });
        const uploadPath = path.join(
            __dirname,
            '..',
            'uploads',
            String(user_id),
            String(newVehicle.id),
        );
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        res.status(201).json({
            message: 'Vehicle added successfully',
            vehicleId: newVehicle.id,
        });
    } catch (err) {
        console.error('Błąd dodawania pojazdu:', err);
        res.status(500).json({ error: err.message });
    }
});

// READ — Lista wszystkich pojazdów
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll({
            where: { userId: req.user.id },
        });
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ — Pojazd po ID
router.get('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle)
            return res.status(404).json({ error: 'Vehicle not found' });
        if (vehicle.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized access' });
        }
        res.json(vehicle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE — Edytuj pojazd
router.put('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle)
            return res.status(404).json({ error: 'Vehicle not found' });
        if (vehicle.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized access' });
        }
        await vehicle.update(req.body);
        res.json({ message: 'Vehicle updated successfully', vehicle });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE — Usuń pojazd i zaktualizuj numery
router.delete('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle)
            return res.status(404).json({ error: 'Vehicle not found' });
        if (vehicle.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized access' });
        }
        const userId = vehicle.userId;
        await vehicle.destroy();
        // Przebuduj numerację custom_number
        const vehicles = await Vehicle.findAll({
            where: { userId },
            order: [['custom_number', 'ASC']],
        });
        for (let i = 0; i < vehicles.length; i++) {
            await vehicles[i].update({ custom_number: i + 1 });
        }
        res.json({ message: 'Vehicle deleted and numbering updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
