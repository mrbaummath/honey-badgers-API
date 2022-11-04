
const mongoose = require('mongoose')


const messageSchema = new mongoose.Schema(
    {
        recipient: {
            type: String, 
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: {virtuals: true }
    }
)

module.exports = mongoose.model('Message', messageSchema)