import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'manager'
        })

        await user.save()

        // Create token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key-here-change-in-production',
            { expiresIn: '24h' }
        )

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { username: user.username, email: user.email, role: user.role }
        })
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message })
    }
})

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        // Find user
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key-here-change-in-production',
            { expiresIn: '24h' }
        )

        res.json({
            message: 'Login successful',
            token,
            user: { username: user.username, email: user.email, role: user.role }
        })
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message })
    }
})

export default router
