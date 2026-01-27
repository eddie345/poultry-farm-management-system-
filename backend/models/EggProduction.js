import mongoose from 'mongoose'

const eggProductionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    totalEggs: {
        type: Number,
        required: true,
        min: 0
    },
    brokenEggs: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    collectionTime: {
        type: String,
        enum: ['Morning', 'Afternoon', 'Evening'],
        default: 'Morning'
    },
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('EggProduction', eggProductionSchema)
