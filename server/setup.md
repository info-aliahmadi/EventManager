# Database Setup Guide

## Issue: MySQL Not Installed or Not Running

Based on the commands we ran, it appears that MySQL is not installed or not running on this system. The server cannot connect to the database.

## Required Steps

1. **Install MySQL Server**:
   - Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
   - Install MySQL Server with the following settings:
     - Host: localhost
     - Port: 3306
     - User: root
     - Password: (set a secure password)

2. **Create the Database**:
   After installing MySQL, create the database:
   ```sql
   CREATE DATABASE rumba_events;
   ```

3. **Update .env File**:
   The .env file has been created at `server/.env` with the following settings:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=rumba_events
   DB_PORT=3306
   SERVER_PORT=5000
   ```
   Update the `DB_PASSWORD` with the password you set during MySQL installation.

4. **Install Dependencies**:
   We've already installed the npm dependencies for the server.

5. **Start the Server**:
   After installing MySQL and creating the database, try starting the server again:
   ```
   cd server
   npm run dev
   ```

6. **Verify Database Connectivity**:
   Once the server is running, access:
   http://localhost:5000/api/database/health

## Troubleshooting

If you continue to have connection issues:
1. Make sure MySQL service is running:
   - In Windows: Open Services and check if MySQL is running
   - In PowerShell: `Get-Service -Name *mysql*`

2. Verify your MySQL credentials:
   - Use MySQL Workbench or MySQL CLI to test the connection
   - Ensure the user has appropriate privileges

3. Check for firewall or network issues:
   - Ensure port 3306 is not blocked 