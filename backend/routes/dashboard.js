import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import EggProduction from '../models/EggProduction.js'
import FeedStock from '../models/FeedStock.js'
import Mortality from '../models/Mortality.js'

const router = express.Router()

// Get dashboard statistics
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

        // Get egg production stats for this week
        const eggProductions = await EggProduction.find({ date: { $gte: weekAgo } })
        const totalEggs = eggProductions.reduce((sum, prod) => sum + prod.totalEggs, 0)

        // Get total feed stock
        const feedStocks = await FeedStock.find()
        const totalFeedStock = feedStocks.reduce((sum, stock) => sum + stock.quantity, 0)

        // Get mortality count for this month
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const mortalityRecords = await Mortality.find({ date: { $gte: monthAgo } })
        const totalMortality = mortalityRecords.reduce((sum, record) => sum + record.count, 0)

        // Calculate active birds (assuming starting flock of 500 - mortality)
        const activeBirds = 500 - totalMortality

        // Chart data for last 7 days
        const chartData = []
        for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
            date.setHours(0, 0, 0, 0)

            const nextDate = new Date(date)
            nextDate.setDate(nextDate.getDate() + 1)

            const dayEggs = await EggProduction.findOne({
                date: { $gte: date, $lt: nextDate }
            })

            chartData.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                eggs: dayEggs ? dayEggs.totalEggs : 0,
                feed: 120 // Mock feed consumption
            })
        }

        res.json({
            stats: {
                totalEggs,
                feedStock: totalFeedStock,
                mortality: totalMortality,
                activeBirds
            },
            chartData
        })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data', error: error.message })
    }
})

export default router
