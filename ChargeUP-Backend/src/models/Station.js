const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Station = sequelize.define('Station', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  stationCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kwSpeed: {
    type: DataTypes.STRING,
    defaultValue: '150 kW'
  },
  connectors: {
    type: DataTypes.STRING,
    defaultValue: 'CCS / CHAdeMO'
  },
  status: {
    type: DataTypes.ENUM('Available', 'Occupied', 'OFFLINE'),
    defaultValue: 'Available'
  },
  lat: {
    type: DataTypes.FLOAT(10, 6),
    allowNull: false
  },
  lng: {
    type: DataTypes.FLOAT(10, 6),
    allowNull: false
  },
  pricePerKwh: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.45
  }
}, { timestamps: true });

module.exports = Station;