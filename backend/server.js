import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import dashboardRoutes from './routes/dashboard.js'
import eggRoutes from './routes/eggs.js'
import feedRoutes from './routes/feed.js'
import mortalityRoutes from './routes/mortality.js'
import reportRoutes from './routes/reports.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/poultry-farm')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err))

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Poultry Farm Management API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/eggs', eggRoutes)
app.use('/api/feed', feedRoutes)
app.use('/api/mortality', mortalityRoutes)
app.use('/api/reports', reportRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something went wrong!', error: err.message })
})

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})
