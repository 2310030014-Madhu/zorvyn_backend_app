const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
    amount: Number,
    type: {
        type: String,
        enum: ['income','expense']
    },
    category: String,
    date: Date,
    description: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

module.exports = mongoose.model('Record', recordSchema)