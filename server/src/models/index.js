const Event = require('./Event');
const Expense = require('./Expense');
const { sequelize } = require('../config/database');

// Additional relationships can be defined here

module.exports = {
  Event,
  Expense,
  sequelize
}; 