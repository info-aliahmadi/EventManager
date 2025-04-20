const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Event = require('./Event');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'events',
      key: 'id',
    },
  },
  category: {
    type: DataTypes.ENUM('Promoter', 'Staff', 'Venue', 'Ad Spend', 'Commission', 'Entertainment', 'Supplies', 'Other'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  paymentMethod: {
    type: DataTypes.ENUM('Cash', 'Bank Transfer', 'Card', 'Other'),
    allowNull: false,
    defaultValue: 'Cash',
  },
  receipt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'expenses',
});

// Establish relationship
Expense.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
Event.hasMany(Expense, { foreignKey: 'eventId', as: 'expenses' });

module.exports = Expense; 