const { Event, Expense, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get financial summary (for dashboard)
exports.getFinancialSummary = async (req, res) => {
  try {
    // Get current period data (default: this month)
    const currentDate = new Date();
    const firstDayCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Get previous period data (default: last month)
    const firstDayPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastDayPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    
    // Calculate total expenses
    const expenseResult = await Expense.sum('amount');
    const totalExpenses = expenseResult || 0;
    
    // Calculate total revenue (estimated from expenses and profit margin)
    // Since there is no EventData model, we'll use a hardcoded revenue calculation
    // In a real scenario, you would get this from your actual revenue data
    const estimatedRevenue = totalExpenses * 1.5; // Assuming 50% profit margin
    const totalRevenue = estimatedRevenue;
    
    // Calculate total profit
    const totalProfit = totalRevenue - totalExpenses;
    
    // Get count of completed events
    const eventsCount = await Event.count({
      where: { status: 'completed' }
    });
    
    // Calculate averages
    const avgRevenuePerEvent = eventsCount > 0 ? totalRevenue / eventsCount : 0;
    const avgExpensesPerEvent = eventsCount > 0 ? totalExpenses / eventsCount : 0;
    const avgProfitPerEvent = eventsCount > 0 ? totalProfit / eventsCount : 0;
    
    // Calculate ROI
    const roi = totalExpenses > 0 ? (totalProfit / totalExpenses) * 100 : 0;
    
    // For monthly comparison, let's just use some placeholder values for now
    // In a real app, you would calculate these properly
    const revenueChange = 5; // Placeholder: 5% increase
    const expensesChange = 2; // Placeholder: 2% increase
    const profitChange = 8; // Placeholder: 8% increase
    const roiChange = 3; // Placeholder: 3% increase
    
    return res.status(200).json({
      totalRevenue,
      totalExpenses,
      totalProfit,
      eventsCount,
      avgRevenuePerEvent,
      avgExpensesPerEvent,
      avgProfitPerEvent,
      roi,
      // Change percentages compared to previous period
      revenueChange,
      expensesChange,
      profitChange,
      roiChange,
      // Current period data
      currentPeriod: {
        revenue: totalRevenue / 3,  // Placeholder value
        expenses: totalExpenses / 3,
        profit: totalProfit / 3,
        roi: roi
      },
      // Previous period data
      previousPeriod: {
        revenue: totalRevenue / 4,  // Placeholder value
        expenses: totalExpenses / 4,
        profit: totalProfit / 4,
        roi: roi - 5
      }
    });
  } catch (error) {
    console.error('Error generating financial summary:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get monthly performance data
exports.getMonthlyPerformance = async (req, res) => {
  try {
    // Since we don't have the EventData model, we'll return placeholder data
    const result = [
      {
        month: '2023-01',
        revenue: 35000,
        expenses: 20000,
        profit: 15000,
        target: 12000
      },
      {
        month: '2023-02',
        revenue: 40000,
        expenses: 22000,
        profit: 18000,
        target: 12000
      },
      {
        month: '2023-03',
        revenue: 38000,
        expenses: 21000,
        profit: 17000,
        target: 12000
      },
      {
        month: '2023-04',
        revenue: 42000,
        expenses: 24000,
        profit: 18000,
        target: 12000
      },
      {
        month: '2023-05',
        revenue: 45000,
        expenses: 25000,
        profit: 20000,
        target: 12000
      },
      {
        month: '2023-06',
        revenue: 48000,
        expenses: 26000,
        profit: 22000,
        target: 12000
      }
    ];
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generating monthly performance:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get event performance comparison
exports.getEventPerformance = async (req, res) => {
  try {
    // Get all events to generate placeholder performance data
    const events = await Event.findAll({
      where: { status: 'completed' },
      include: [{ model: Expense, as: 'expenses' }]
    });
    
    // Create a map to group events by name
    const eventsByName = {};
    
    events.forEach(event => {
      const eventName = event.name;
      
      if (!eventsByName[eventName]) {
        eventsByName[eventName] = {
          name: eventName,
          count: 0,
          totalExpenses: 0,
          // We'll estimate revenue as 1.5x expenses
          totalRevenue: 0,
          totalProfit: 0,
          avgAttendance: Math.floor(Math.random() * 200) + 50, // Random placeholder
          avgProfit: 0
        };
      }
      
      eventsByName[eventName].count++;
      
      let eventExpenses = 0;
      if (event.expenses) {
        event.expenses.forEach(expense => {
          eventExpenses += parseFloat(expense.amount);
        });
      }
      
      eventsByName[eventName].totalExpenses += eventExpenses;
      eventsByName[eventName].totalRevenue += eventExpenses * 1.5; // Estimated revenue
    });
    
    // Calculate derived values
    Object.values(eventsByName).forEach(event => {
      event.totalProfit = event.totalRevenue - event.totalExpenses;
      event.avgProfit = event.count > 0 ? event.totalProfit / event.count : 0;
    });
    
    // Sort by total profit in descending order
    const result = Object.values(eventsByName).sort((a, b) => b.totalProfit - a.totalProfit);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generating event performance:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get expense breakdown by category
exports.getExpenseBreakdown = async (req, res) => {
  try {
    // Get total expenses
    const totalExpenses = await Expense.sum('amount') || 0;
    
    // Get expenses grouped by category
    const categories = await Expense.findAll({
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['category'],
      order: [[sequelize.literal('total'), 'DESC']]
    });
    
    // Format the result and calculate percentages
    const result = categories.map(category => ({
      category: category.category,
      total: parseFloat(category.getDataValue('total')),
      percentage: totalExpenses > 0 
        ? (parseFloat(category.getDataValue('total')) / totalExpenses) * 100 
        : 0
    }));
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generating expense breakdown:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}; 