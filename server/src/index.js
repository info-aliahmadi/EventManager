require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection, sequelize } = require('./config/database');

// Import routes
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const reportRoutes = require('./routes/reportRoutes');
const systemRoutes = require('./routes/systemRoutes');

// Initialize app
const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', expenseRoutes);
app.use('/api', reportRoutes);
app.use('/api', systemRoutes);

// Root endpoint for basic health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Rumba Event Metrics API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Test database connection
testConnection();

// Sync models with database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// Add after all other routes and middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err); // Log the full error stack
  // Avoid sending detailed errors in production
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  res.status(statusCode).json({ message: message, error: process.env.NODE_ENV !== 'production' ? err.stack : undefined });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await syncDatabase();
}); 