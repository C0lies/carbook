/* eslint-disable prettier/prettier */
import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../db';

type UserAttributes = {
    id?: number;
    email: string;
    password: string;
    role?: string;
};

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'role'>;

export const User = sequelize.define<
    Model<UserAttributes, UserCreationAttributes>
>(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user',
        },
    },
    {
        tableName: 'users',
        timestamps: true,
    },
);
