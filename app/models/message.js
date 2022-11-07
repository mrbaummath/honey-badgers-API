
const mongoose = require('mongoose')


const messageSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true 
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            default: 'would love to connect'
        }
        
    },
    {
        timestamps: true,
        toObject: { virtuals: true }, // do we need virtuals here ? V2 should be in a separate branch 
        toJSON: {virtuals: true }
    }
)

module.exports = mongoose.model('Message', messageSchema)