# 🚀 Quick Start Guide - Poultry Farm Management System

## Current Status
✅ Node.js is installed on your system  
❌ The terminal session needs to be refreshed

## How to Run the Application

### Option 1: Restart VS Code (Recommended)
1. **Close VS Code completely**
2. **Reopen VS Code**
3. **Open a new terminal** in VS Code (Terminal → New Terminal)
4. Follow the commands below

### Option 2: Use External PowerShell
1. Open a **NEW PowerShell window** (not the one in VS Code)
2. Follow the commands below

---

## Step-by-Step Commands

### Step 1: Install Frontend Dependencies
```powershell
cd C:\Users\DOME\Desktop\PythonFullCourse\poultry-farm\frontend
npm install
```
⏱️ This will take 1-2 minutes

### Step 2: Install Backend Dependencies
```powershell
cd C:\Users\DOME\Desktop\PythonFullCourse\poultry-farm\backend
npm install
```
⏱️ This will take about 30 seconds

### Step 3: Create Backend Environment File
```powershell
cd C:\Users\DOME\Desktop\PythonFullCourse\poultry-farm\backend
copy .env.example .env
```

### Step 4: Start Backend Server
Open a **NEW** terminal window and run:
```powershell
cd C:\Users\DOME\Desktop\PythonFullCourse\poultry-farm\backend
npm run dev
```
✅ Backend will run on http://localhost:5000

### Step 5: Start Frontend Server
Open **ANOTHER** terminal window and run:
```powershell
cd C:\Users\DOME\Desktop\PythonFullCourse\poultry-farm\frontend
npm run dev
```
✅ Frontend will run on http://localhost:3000

### Step 6: Open Application
Your browser should automatically open to http://localhost:3000

If not, manually open: **http://localhost:3000**

---

## Default Login (Create Account)
Since the database is empty, you'll need to:
1. Click "Register" or create a user via API
2. Or modify the Login component to allow demo login

**Demo credentials to try:**
- Username: `admin`
- Password: `admin123`

---

## Troubleshooting

### "node is not recognized"
- Make sure you **closed and reopened** your terminal/VS Code
- Verify installation: `node --version` should show a version number

### "Cannot find module"
- Run `npm install` in both frontend and backend directories

### "Port already in use"
- Close any other applications using ports 3000 or 5000
- Or change the ports in package.json and vite.config.js

### Backend won't start
- Make sure **MongoDB is installed and running**
- Download from: https://www.mongodb.com/try/download/community

---

## Quick Copy-Paste (All Commands)

**Terminal 1 (Backend):**
```powershell
cd C:\Users\DOME\Desktop\PythonFullCourse\poultry-farm\backend
npm install
copy .env.example .env
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd C:\Users\DOME\Desktop\PythonFullCourse\poultry-farm\frontend
npm install
npm run dev
```

---

## 📁 Project Location
`C:\Users\DOME\Desktop\PythonFullCourse\poultry-farm`

## 📖 Documentation
See [walkthrough.md](file:///C:/Users/DOME/.gemini/antigravity/brain/0a7c6245-d9dd-4477-831d-be9239131843/walkthrough.md) for complete documentation.

---

**Need Help?** Let me know if you encounter any errors!
