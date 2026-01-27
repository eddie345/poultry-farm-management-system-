import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import FeedStock from '../models/FeedStock.js'

const router = express.Router()

// Get all feed stocks
router.get('/stock', authMiddleware, async (req, res) => {
    try {
        const stocks = await FeedStock.find().sort({ createdAt: -1 })
        res.json(stocks)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feed stock', error: error.message })
    }
})

// Add new feed stock
router.post('/stock', authMiddleware, async (req, res) => {
    try {
        const { feedType, quantity, unit, supplier, purchaseDate, expiryDate, costPerUnit } = req.body

        const stock = new FeedStock({
            feedType,
            quantity,
            unit,
            supplier,
            purchaseDate,
            expiryDate,
            costPerUnit
        })

        await stock.save()
        res.status(201).json({ message: 'Feed stock added', stock })
    } catch (error) {
        res.status(500).json({ message: 'Error adding feed stock', error: error.message })
    }
})

// Update feed stock
router.put('/stock/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        const stock = await FeedStock.findByIdAndUpdate(id, updates, { new: true })
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' })
        }

        res.json({ message: 'Stock updated', stock })
    } catch (error) {
        res.status(500).json({ message: 'Error updating stock', error: error.message })
    }
})

// Get low stock alerts
router.get('/alerts', authMiddleware, async (req, res) => {
    try {
        const lowStockThreshold = 100
        const stocks = await FeedStock.find({ quantity: { $lt: lowStockThreshold } })
        res.json(stocks)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alerts', error: error.message })
    }
})

export default router
