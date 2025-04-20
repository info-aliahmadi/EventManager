const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Get all expenses for an event
router.get('/events/:eventId/expenses', expenseController.getEventExpenses);

// Get a specific expense
router.get('/expenses/:id', expenseController.getExpenseById);

// Create a new expense
router.post('/events/:eventId/expenses', expenseController.createExpense);

// Update an expense
router.put('/expenses/:id', expenseController.updateExpense);

// Delete an expense
router.delete('/expenses/:id', expenseController.deleteExpense);

module.exports = router; 