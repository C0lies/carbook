/* eslint-disable prettier/prettier */
import { User } from './user';
import { Vehicle } from './vehicle';

User.hasMany(Vehicle, { foreignKey: 'userId' });
Vehicle.belongsTo(User, { foreignKey: 'userId' });

export { User, Vehicle };
