import mongoose from 'mongoose'

const feedStockSchema = new mongoose.Schema({
    feedType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        enum: ['kg', 'bags', 'tons'],
        default: 'kg'
    },
    supplier: {
        type: String,
        required: true
    },
    purchaseDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    costPerUnit: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('FeedStock', feedStockSchema)
