const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChargingSession = sequelize.define('ChargingSession', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  energyConsumedKwh: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  chargingRateKw: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 7.40
  },
  currentAmps: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 32.00
  },
  carbonSavedKg: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('IN_PROGRESS', 'COMPLETED', 'FAILED'),
    defaultValue: 'IN_PROGRESS'
  },
  startTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, { timestamps: true });

module.exports = ChargingSession;