import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import EggProduction from '../models/EggProduction.js'

const router = express.Router()

// Get all egg production records
router.get('/production', authMiddleware, async (req, res) => {
    try {
        const productions = await EggProduction.find().sort({ date: -1 }).limit(50)
        res.json(productions)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching production data', error: error.message })
    }
})

// Add new egg production record
router.post('/production', authMiddleware, async (req, res) => {
    try {
        const { date, totalEggs, brokenEggs, collectionTime, notes } = req.body

        const production = new EggProduction({
            date,
            totalEggs,
            brokenEggs,
            collectionTime,
            notes
        })

        await production.save()
        res.status(201).json({ message: 'Production record added', production })
    } catch (error) {
        res.status(500).json({ message: 'Error adding production record', error: error.message })
    }
})

// Get egg production analytics
router.get('/analytics', authMiddleware, async (req, res) => {
    try {
        const productions = await EggProduction.find().sort({ date: -1 }).limit(30)

        const totalEggs = productions.reduce((sum, prod) => sum + prod.totalEggs, 0)
        const totalBroken = productions.reduce((sum, prod) => sum + prod.brokenEggs, 0)
        const avgPerDay = productions.length > 0 ? totalEggs / productions.length : 0

        res.json({
            totalEggs,
            totalBroken,
            avgPerDay: Math.round(avgPerDay),
            successRate: ((totalEggs - totalBroken) / totalEggs * 100).toFixed(1)
        })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message })
    }
})

export default router
