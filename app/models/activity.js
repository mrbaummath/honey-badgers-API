const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema(
    {
        activity: {
            type: String,
            required: true,
        },
        accessibility: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['education', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork'],
        },
        participants: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        // buddies: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User',
        // }],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Activity', activitySchema)