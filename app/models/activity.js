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
        type: { // lovely use of enum, consider using a different name since type is a very common reserved keyword ( got away with it here because its a key of an object / a string )
            type: String,
            required: true,
            enum: ['education', 'recreational', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork'],
        },
        participants: { // consider adding custom validation to ensure that we never have non positive integers here - ( like 1.5 peoples is kinda gruesome )
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
        buddies: [{ // confused by use of name here - users already have a many to many with themselves by this key, try using a different name here for a new relationship
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        notes: [noteSchema],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        
    },
    {
        timestamps: true,
        toObject: { virtuals: true }, // NICE
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

activitySchema.virtual('categoryName').get(function () {
    return `${this.type[0].toUpperCase()}${this.type.slice(1)}`
})

activitySchema.virtual('categoryIcon').get(function () {
    if(this.type == 'education'){ // use strict equality here, only use loose inequality when you have to
      return ('graduation cap')  // missing 2 spaces 
    } else if (this.type == 'recreational'){
        return ('table tennis')
    } else if (this.type == 'social'){
        return ('handshake')
    } else if (this.type == 'diy'){
        return ('configure')
    } else if (this.type == 'cooking'){
        return ('food')
    } else if (this.type == 'music'){
        return ('music')
    } else if (this.type == 'busywork'){
        return ('edit outline')
    } else if (this.type == 'charity'){
        return ('heart')
    } else if (this.type == 'relaxation'){
        return ('puzzle')
    }
})



module.exports = mongoose.model('Activity', activitySchema)