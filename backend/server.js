import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
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
app.use(cors({
    origin: '*', // For production, you could restrict this to your Vercel domain later
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Database connection & Auto-seeding
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/poultry-farm')
    .then(async () => {
        console.log('✅ Connected to MongoDB')

        // Auto-seed admin if no users exist
        try {
            const userCount = await User.countDocuments()
            if (userCount === 0) {
                const hashedPassword = await bcrypt.hash('admin123', 10)
                const admin = new User({
                    username: 'admin',
                    email: 'admin@example.com',
                    password: hashedPassword,
                    role: 'admin'
                })
                await admin.save()
                console.log('🚀 Auto-seeded admin user: admin / admin123')
            }
        } catch (seedErr) {
            console.error('❌ Auto-seeding failed:', seedErr)
        }
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err))

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Poultry Farm Management API', status: 'Healthy' })
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
