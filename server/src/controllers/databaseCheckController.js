const { Event, EventData, Expense, sequelize } = require('../models');

// Check database connection and model integrity
exports.checkDatabaseHealth = async (req, res) => {
  try {
    // Test connection
    await sequelize.authenticate();
    
    // Check models by trying to query each table
    const modelChecks = {
      Event: false,
      EventData: false,
      Expense: false
    };
    
    try {
      await Event.findOne();
      modelChecks.Event = true;
    } catch (error) {
      console.error('Error checking Event model:', error);
    }
    
    try {
      await EventData.findOne();
      modelChecks.EventData = true;
    } catch (error) {
      console.error('Error checking EventData model:', error);
    }
    
    try {
      await Expense.findOne();
      modelChecks.Expense = true;
    } catch (error) {
      console.error('Error checking Expense model:', error);
    }
    
    // Get database metadata
    const [dbInfo] = await sequelize.query(`
      SELECT 
        table_schema as 'database',
        version() as 'version',
        @@character_set_database as 'charset',
        @@collation_database as 'collation'
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_NAME}'
      LIMIT 1
    `);
    
    // Return full health check result
    return res.status(200).json({
      connection: {
        status: 'connected',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
      },
      models: modelChecks,
      database: dbInfo[0] || {},
      tables: await getTablesInfo()
    });
  } catch (error) {
    console.error('Database check failed:', error);
    return res.status(500).json({
      connection: {
        status: 'failed',
        error: error.message
      }
    });
  }
};

// Get database table details
async function getTablesInfo() {
  try {
    const [tables] = await sequelize.query(`
      SELECT 
        table_name,
        table_rows as 'rows',
        data_length as 'size',
        create_time,
        update_time
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_NAME}'
    `);
    return tables;
  } catch (error) {
    console.error('Error getting tables info:', error);
    return [];
  }
} 