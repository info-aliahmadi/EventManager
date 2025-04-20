# Welcome to your Lovable project

## Project info

**URL**: eshraq.xyz

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the 

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Rumba Event Metrics

A comprehensive application for tracking and analyzing event performance metrics for Rumba entertainment events.

## Database System Overview

The application uses MySQL as the database and Sequelize ORM for database operations. The database system includes:

1. **Models**:
   - **Event**: Stores information about events (name, date, venue, etc.)
   - **EventData**: Stores performance metrics for events (attendance, revenue, etc.)
   - **Expense**: Tracks expenses associated with events

2. **Relationships**:
   - Each Event can have one EventData record
   - Each Event can have multiple Expense records

## Database Setup Instructions

### Prerequisites
- MySQL 5.7 or higher
- Node.js 14 or higher
- npm or yarn

### Setup Steps

1. **Create MySQL Database**:
   ```sql
   CREATE DATABASE rumba_events;
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the server directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=rumba_events
   DB_PORT=3306
   SERVER_PORT=5000
   ```

3. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

4. **Start the Server**:
   ```bash
   npm run dev
   ```
   This will start the server and automatically create all the database tables based on the defined models.

5. **Verify Database Setup**:
   Navigate to `http://localhost:5000/api/database/health` to check the database connection and tables.

## Database Structure

### Tables

1. **events**: 
   - Stores event details including name, type, venue, and deal information
   - Key fields: id, name, eventType, eventDate, venueName, status

2. **event_data**:
   - Stores metrics for completed events
   - Key fields: id, eventId, attendeeCount, revenue, barSales, entranceFees

3. **expenses**:
   - Tracks all expenses associated with events
   - Key fields: id, eventId, category, amount, paymentDate, paymentMethod

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### Event Data
- `GET /api/events/:eventId/data` - Get data for a specific event
- `POST /api/events/:eventId/data` - Create or update event data
- `DELETE /api/events/:eventId/data` - Delete event data

### Expenses
- `GET /api/events/:eventId/expenses` - Get all expenses for an event
- `GET /api/expenses/:id` - Get a specific expense
- `POST /api/events/:eventId/expenses` - Create a new expense
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Delete an expense

### Reports
- `GET /api/financial-summary` - Get financial summary for dashboard
- `GET /api/monthly-performance` - Get monthly performance data
- `GET /api/event-performance` - Get event performance comparison
- `GET /api/expense-breakdown` - Get expense breakdown by category

### System
- `GET /api/database/health` - Check database health and connectivity

## Troubleshooting Database Issues

1. **Connection Issues**:
   - Verify MySQL is running
   - Check that the credentials in the `.env` file are correct
   - Ensure the database exists

2. **Model Sync Issues**:
   - Check the console logs for specific error messages
   - Verify that the database user has sufficient privileges

3. **Query Errors**:
   - Check for compatibility between model definitions and existing tables
   - Examine the server logs for detailed error information
