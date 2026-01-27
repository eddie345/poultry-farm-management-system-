import mongoose from 'mongoose'

const mortalitySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    count: {
        type: Number,
        required: true,
        min: 1
    },
    ageGroup: {
        type: String,
        enum: ['Chick', 'Juvenile', 'Adult'],
        required: true
    },
    cause: {
        type: String,
        required: true
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

export default mongoose.model('Mortality', mortalitySchema)
