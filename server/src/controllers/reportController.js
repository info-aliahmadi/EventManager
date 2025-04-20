const { Event, EventData, Expense, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get financial summary (for dashboard)
exports.getFinancialSummary = async (req, res) => {
  try {
    // Get total revenue
    const revenueResult = await EventData.sum('revenue');
    const totalRevenue = revenueResult || 0;
    
    // Get total expenses
    const expenseResult = await Expense.sum('amount');
    const totalExpenses = expenseResult || 0;
    
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
    
    return res.status(200).json({
      totalRevenue,
      totalExpenses,
      totalProfit,
      eventsCount,
      avgRevenuePerEvent,
      avgExpensesPerEvent,
      avgProfitPerEvent,
      roi,
    });
  } catch (error) {
    console.error('Error generating financial summary:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get monthly performance data
exports.getMonthlyPerformance = async (req, res) => {
  try {
    // Get monthly data for the last 6 months
    const result = await sequelize.query(`
      SELECT 
        DATE_FORMAT(e.eventDate, '%Y-%m') AS month,
        SUM(ed.revenue) AS revenue,
        SUM(ex.amount) AS expenses,
        SUM(ed.revenue) - SUM(ex.amount) AS profit
      FROM 
        events e
        LEFT JOIN event_data ed ON e.id = ed.eventId
        LEFT JOIN expenses ex ON e.id = ex.eventId
      WHERE 
        e.status = 'completed'
        AND e.eventDate >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY 
        DATE_FORMAT(e.eventDate, '%Y-%m')
      ORDER BY 
        month ASC
    `, { type: sequelize.QueryTypes.SELECT });
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generating monthly performance:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get event performance comparison
exports.getEventPerformance = async (req, res) => {
  try {
    // Get performance metrics grouped by event name
    const result = await sequelize.query(`
      SELECT 
        e.name,
        COUNT(DISTINCT e.id) AS count,
        SUM(ed.revenue) AS totalRevenue,
        SUM(ex.amount) AS totalExpenses,
        SUM(ed.revenue) - SUM(ex.amount) AS totalProfit,
        AVG(ed.attendeeCount) AS avgAttendance,
        (SUM(ed.revenue) - SUM(ex.amount)) / COUNT(DISTINCT e.id) AS avgProfit
      FROM 
        events e
        LEFT JOIN event_data ed ON e.id = ed.eventId
        LEFT JOIN expenses ex ON e.id = ex.eventId
      WHERE 
        e.status = 'completed'
      GROUP BY 
        e.name
      ORDER BY 
        totalProfit DESC
    `, { type: sequelize.QueryTypes.SELECT });
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generating event performance:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get expense breakdown by category
exports.getExpenseBreakdown = async (req, res) => {
  try {
    const result = await sequelize.query(`
      SELECT 
        ex.category,
        SUM(ex.amount) AS total,
        (SUM(ex.amount) / (SELECT SUM(amount) FROM expenses)) * 100 AS percentage
      FROM 
        expenses ex
      GROUP BY 
        ex.category
      ORDER BY 
        total DESC
    `, { type: sequelize.QueryTypes.SELECT });
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generating expense breakdown:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 