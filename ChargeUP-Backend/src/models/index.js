const sequelize = require('../config/database');
const User = require('./User');
const UserProfile = require('./UserProfile');
const Station = require('./Station');
const ChargingSession = require('./Session');
const Vehicle = require('./Vehicle');
const Review = require('./Review');

const models = {
  User,
  UserProfile,
  Station,
  ChargingSession,
  Vehicle,
  Review,
};

// 1. User <-> UserProfile (1-to-1 Profile relationship)
User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile', onDelete: 'CASCADE' });
UserProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 2. User <-> ChargingSession
User.hasMany(ChargingSession, { foreignKey: 'userId', onDelete: 'CASCADE' });
ChargingSession.belongsTo(User, { foreignKey: 'userId' });

// 3. Station <-> ChargingSession
Station.hasMany(ChargingSession, { foreignKey: 'stationId', onDelete: 'CASCADE' });
ChargingSession.belongsTo(Station, { foreignKey: 'stationId' });

// 4. User <-> Station (Operator relationship)
User.hasMany(Station, { foreignKey: 'operatorId', as: 'operatedStations', onDelete: 'SET NULL' });
Station.belongsTo(User, { foreignKey: 'operatorId', as: 'operator' });

// 5. User <-> Vehicle
User.hasMany(Vehicle, { foreignKey: 'userId', onDelete: 'CASCADE' });
Vehicle.belongsTo(User, { foreignKey: 'userId' });

// 6. User <-> Review
User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  ...models,
};