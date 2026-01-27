import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import EggProduction from '../models/EggProduction.js'
import FeedStock from '../models/FeedStock.js'
import Mortality from '../models/Mortality.js'

const router = express.Router()

// Generate report
router.get('/generate', authMiddleware, async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query

        const start = new Date(startDate)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)

        let reportData = {}

        switch (type) {
            case 'production':
                const eggRecords = await EggProduction.find({
                    date: { $gte: start, $lte: end }
                })
                const totalEggs = eggRecords.reduce((sum, r) => sum + r.totalEggs, 0)
                const brokenEggs = eggRecords.reduce((sum, r) => sum + r.brokenEggs, 0)

                reportData = {
                    totalEggs,
                    brokenEggs,
                    averagePerDay: eggRecords.length > 0 ? Math.round(totalEggs / eggRecords.length) : 0,
                    successRate: ((totalEggs - brokenEggs) / totalEggs * 100).toFixed(1)
                }
                break

            case 'feed':
                const feedStocks = await FeedStock.find({
                    purchaseDate: { $gte: start, $lte: end }
                })
                const totalStock = feedStocks.reduce((sum, s) => sum + s.quantity, 0)
                const stockValue = feedStocks.reduce((sum, s) => sum + (s.quantity * s.costPerUnit), 0)

                reportData = {
                    totalStock,
                    totalConsumption: 842, // Mock data
                    averageConsumption: 120,
                    stockValue
                }
                break

            case 'mortality':
                const mortalityRecords = await Mortality.find({
                    date: { $gte: start, $lte: end }
                })
                const totalDeaths = mortalityRecords.reduce((sum, r) => sum + r.count, 0)
                const byAge = mortalityRecords.reduce((acc, r) => {
                    acc[r.ageGroup] = (acc[r.ageGroup] || 0) + r.count
                    return acc
                }, {})

                reportData = {
                    totalDeaths,
                    byAge,
                    mortalityRate: (totalDeaths / 500 * 100).toFixed(1),
                    commonCause: 'Natural causes'
                }
                break

            case 'financial':
                // Mock financial data
                reportData = {
                    revenue: 8250,
                    expenses: 4210,
                    netProfit: 4040,
                    profitMargin: 49
                }
                break

            case 'comprehensive':
                // Combine all reports
                const eggs = await EggProduction.find({ date: { $gte: start, $lte: end } })
                const feed = await FeedStock.find()
                const mortality = await Mortality.find({ date: { $gte: start, $lte: end } })

                reportData = {
                    production: {
                        totalEggs: eggs.reduce((sum, r) => sum + r.totalEggs, 0)
                    },
                    feedStock: feed.reduce((sum, s) => sum + s.quantity, 0),
                    mortality: mortality.reduce((sum, r) => sum + r.count, 0)
                }
                break

            default:
                return res.status(400).json({ message: 'Invalid report type' })
        }

        res.json({
            type,
            dateRange: { startDate, endDate },
            summary: reportData
        })
    } catch (error) {
        res.status(500).json({ message: 'Error generating report', error: error.message })
    }
})

// Export report (placeholder for PDF/Excel export)
router.get('/export/:format', authMiddleware, async (req, res) => {
    try {
        const { format } = req.params
        const { type, startDate, endDate } = req.query

        // In production, you would generate PDF/Excel here
        // For now, return a simple text response
        res.json({
            message: `Export to ${format} functionality would be implemented here`,
            type,
            dateRange: { startDate, endDate }
        })
    } catch (error) {
        res.status(500).json({ message: 'Error exporting report', error: error.message })
    }
})

export default router
