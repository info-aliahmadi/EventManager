const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventType: {
    type: DataTypes.ENUM('weekly', 'monthly', 'one-time'),
    allowNull: false,
  },
  dayOfWeek: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  venueName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dealType: {
    type: DataTypes.ENUM('revenue-share', 'revenue-share-entrance'),
    allowNull: false,
  },
  commissions: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isProgressiveCommission: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  paymentTerms: {
    type: DataTypes.ENUM('one-week', 'two-weeks', 'three-weeks', 'one-month'),
    allowNull: false,
  },
  entranceShare: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'completed', 'cancelled'),
    defaultValue: 'upcoming',
  },
}, {
  timestamps: true,
  tableName: 'events',
});

module.exports = Event; 