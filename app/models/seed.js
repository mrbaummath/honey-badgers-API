// added this seed file to test all activity routes

const mongoose = require('mongoose')
const Activity = require('./activity')
const db = require('../../config/db')

const startActivities = [
    { activity: 'Take a bubble bath', accessibility: 0.1, type: 'relaxation', participants: 1, price: 0.15, progress: 1 },
    { activity: 'Clean out sock drawer', accessibility: 0, type: 'busywork', participants: 1, price: 0, progress: .5 },
    { activity: 'Host a board game night', accessibility: 0.5, type: 'social', participants: 4, price: 0.1, progress: 0},
]

// connect to database
mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        Activity.deleteMany({ owner: null })
            .then(deletedActivities => {
                console.log('deletedActivities', deletedActivities)

                Activity.create(startActivities)
                    .then(newActivities => {
                        console.log('the new activities', newActivities)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log(error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })