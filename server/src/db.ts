/* eslint-disable prettier/prettier */
import { Sequelize } from 'sequelize';

import { config } from './config';

const sequelize = new Sequelize(
    config.postgres.database,
    config.postgres.user,
    config.postgres.password,
    {
        host: config.postgres.host,
        port: config.postgres.port,
        dialect: 'postgres',
        logging: false, // LOGGING SQL
    }
);

export { sequelize };
