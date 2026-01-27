import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import Mortality from '../models/Mortality.js'

const router = express.Router()

// Get all mortality records
router.get('/records', authMiddleware, async (req, res) => {
    try {
        const records = await Mortality.find().sort({ date: -1 }).limit(50)
        res.json(records)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mortality records', error: error.message })
    }
})

// Add new mortality record
router.post('/records', authMiddleware, async (req, res) => {
    try {
        const { date, count, ageGroup, cause, notes } = req.body

        const record = new Mortality({
            date,
            count,
            ageGroup,
            cause,
            notes
        })

        await record.save()
        res.status(201).json({ message: 'Mortality record added', record })
    } catch (error) {
        res.status(500).json({ message: 'Error adding mortality record', error: error.message })
    }
})

// Get mortality analytics
router.get('/analytics', authMiddleware, async (req, res) => {
    try {
        const records = await Mortality.find().sort({ date: -1 }).limit(30)

        const totalDeaths = records.reduce((sum, record) => record.count, 0)
        const byAgeGroup = records.reduce((acc, record) => {
            acc[record.ageGroup] = (acc[record.ageGroup] || 0) + record.count
            return acc
        }, {})

        // Calculate mortality rate (assuming 500 total birds)
        const mortalityRate = (totalDeaths / 500 * 100).toFixed(1)

        res.json({
            totalDeaths,
            byAgeGroup,
            mortalityRate
        })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message })
    }
})

export default router
