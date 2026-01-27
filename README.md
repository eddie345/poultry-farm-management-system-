# Poultry Farm Management System

A comprehensive web-based poultry farm management system built with React, Node.js, Express, MongoDB, and Tailwind CSS.

## Features

1. **Login Page** - User authentication and session management
2. **Dashboard** - Farm overview with key metrics and statistics
3. **Reports Module** - Generate and export various farm reports
4. **Egg Production Module** - Track and manage daily egg production
5. **Feed Stock Module** - Monitor feed inventory and consumption
6. **Mortality Rates Module** - Track and analyze bird mortality

## Prerequisites

Before running this application, make sure you have:
- Node.js (v18 or higher) installed
- MongoDB installed and running
- npm or yarn package manager

## Installation

### 1. Install Node.js
Download and install Node.js from [https://nodejs.org/](https://nodejs.org/)

### 2. Install MongoDB
Download and install MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

### 3. Clone/Download Project
This project is already set up in: `C:\Users\DOME\Desktop\PythonFullCourse\poultry-farm`

### 4. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 5. Configure Environment Variables

Create a `.env` file in the backend directory:
```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your configuration.

## Running the Application

### Start MongoDB
Make sure MongoDB is running on your system.

### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

## Default Login Credentials

After first run, you can create a user account from the login page.

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Recharts
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful API

## Project Structure

```
poultry-farm/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── EggProduction/
│   │   │   ├── FeedStock/
│   │   │   ├── Mortality/
│   │   │   ├── Reports/
│   │   │   └── Shared/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── backend/           # Node.js/Express API
    ├── models/
    ├── routes/
    ├── middleware/
    ├── server.js
    └── package.json
```

## Support

For issues or questions, please contact the development team.
