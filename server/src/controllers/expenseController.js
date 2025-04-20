const { Expense, Event } = require('../models');

// Get all expenses for an event
exports.getEventExpenses = async (req, res) => {
  const { eventId } = req.params;
  
  try {
    const expenses = await Expense.findAll({
      where: { eventId },
      order: [['createdAt', 'DESC']],
    });
    
    return res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get expense by ID
exports.getExpenseById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const expense = await Expense.findByPk(id, {
      include: [{ model: Event, as: 'event' }],
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    return res.status(200).json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new expense
exports.createExpense = async (req, res) => {
  const { eventId } = req.params;
  const expenseData = req.body;
  
  try {
    // Check if the event exists
    const event = await Event.findByPk(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const newExpense = await Expense.create({
      ...expenseData,
      eventId,
    });
    
    return res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  try {
    const expense = await Expense.findByPk(id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    await expense.update(updates);
    return res.status(200).json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  
  try {
    const expense = await Expense.findByPk(id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    await expense.destroy();
    return res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 