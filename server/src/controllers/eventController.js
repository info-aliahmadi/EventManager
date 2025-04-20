const { Event, Expense, sequelize } = require('../models');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id, {
      include: [
        { model: Expense, as: 'expenses' }
      ],
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new event and its initial expenses
exports.createEvent = async (req, res) => {
  const eventData = req.body; // Contains both event details and the expenses array
  
  // Extract userId from authenticated user (assuming authentication middleware sets req.user)
  const userId = req.user ? req.user.id : null;
  
  console.log('Received event data:', JSON.stringify(eventData));
  console.log('User ID from authentication:', userId);
  
  // Add userId to the event data
  const eventDataWithUser = {
    ...eventData,
    userId: userId
  };
  
  const t = await sequelize.transaction(); // Start a transaction

  try {
    // 1. Create the Event within the transaction with userId included
    console.log('Attempting to create event with data:', JSON.stringify(eventDataWithUser));
    const newEvent = await Event.create(eventDataWithUser, { transaction: t });
    console.log('Event created successfully:', newEvent.id);

    // 2. If event created and expenses exist, create associated expenses
    if (newEvent && eventData.expenses && eventData.expenses.length > 0) {
      // Add the eventId to each expense item
      const expensesWithEventId = eventData.expenses.map(expense => ({
        ...expense,
        eventId: newEvent.id, // Link expense to the newly created event
      }));

      // Bulk create expenses within the same transaction
      await Expense.bulkCreate(expensesWithEventId, { transaction: t });
    }

    // If everything successful, commit the transaction
    await t.commit();

    // Fetch the created event with its associations to return
    const createdEventWithDetails = await Event.findByPk(newEvent.id, {
      include: [{ model: Expense, as: 'expenses' }]
    });

    return res.status(201).json(createdEventWithDetails);

  } catch (error) {
    // If any error occurs, rollback the transaction
    await t.rollback(); 
    console.error('Error creating event with expenses:', error);
    // Check for validation errors specifically
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: error.errors.map(e => ({ field: e.path, message: e.message })) 
      });
    }
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  try {
    const event = await Event.findByPk(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    await event.update(updates);
    return res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  
  try {
    const event = await Event.findByPk(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Use a transaction to delete related data
    await sequelize.transaction(async (t) => {
      // Delete related expenses
      await Expense.destroy({ where: { eventId: id }, transaction: t });

      // Delete the event itself
      await event.destroy({ transaction: t });
    });

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};