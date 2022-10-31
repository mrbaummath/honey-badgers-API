const mongoose = require('mongoose')
const noteSchema = require('./note')

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
            enum: ['education', 'recreational', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork'],
        },
        participants: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        progress: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            default: 0
        },
        private: {
            type: Boolean,
            required: true,
            default: false
        },
        // buddies: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User',
        // }],
        notes: [noteSchema],
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

activitySchema.virtual('publicNotes').get(function () {
    const publicNotes = this.notes.filter(noteObject => noteObject.private === false)
    return publicNotes.map(noteObject => ({
        "text": noteObject.text,
        "author": noteObject.owner.email
    }))
})



module.exports = mongoose.model('Activity', activitySchema)