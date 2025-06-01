/* eslint-disable prettier/prettier */
import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../db';

type VehicleAttributes = {
    id?: number;
    vin: string;
    brand?: string;
    model?: string;
    version?: string;
    engine?: string;
    first_registration?: Date;
    userId: number;
    custom_number: number;
};

type VehicleCreationAttributes = {} & Optional<
    VehicleAttributes,
    'id' | 'brand' | 'model' | 'version' | 'engine' | 'first_registration'
>;

export const Vehicle = sequelize.define<
    Model<VehicleAttributes, VehicleCreationAttributes>
>(
    'Vehicle',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        vin: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        brand: DataTypes.STRING,
        model: DataTypes.STRING,
        version: DataTypes.STRING,
        engine: DataTypes.STRING,
        first_registration: DataTypes.DATE,
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        custom_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'vehicles',
        timestamps: true,
    },
);
