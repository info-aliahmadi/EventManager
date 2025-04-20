const User = require('./User');
const Event = require('./Event');
const Expense = require('./Expense');

const { sequelize } = require('../config/database');

// Define relationships
User.hasMany(Event, { foreignKey: 'userId' });
Event.belongsTo(User, { foreignKey: 'userId' });

Event.hasMany(Expense, { foreignKey: 'eventId' });
Expense.belongsTo(Event, { foreignKey: 'eventId' });


module.exports = {
  User,
  Event,
  Expense,
  sequelize
}; 