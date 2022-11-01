const mongoose = require('mongoose')
const Activity = require('./activity')
const db = require('../../config/db')

const startActivities = [
    { activity: 'Take a bubble bath', accessibility: 0.1, type: 'relaxation', participants: 1, price: 0.15, progress: 100 },
    { activity: 'Clean out sock drawer', accessibility: 0, type: 'busywork', participants: 1, price: 0, progress: 50 },
    { activity: 'Host a board game night', accessibility: 0.5, type: 'social', participants: 4, price: 0.1, progress: 0},
]

const types = ['education', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork']
const userIds =['635e77d57930a2cd84f10f72','635e89f983c3bac000a5b5ec', '635fcd2e20335c848dc124e4', '635fd912e374a9a5baf24cd7', '63602f8a401750583009a2cd', '6360320d401750583009a2d7']

const activities = []



for (let i = 0; i < 10; i++) {
    let type = types[0]
    let user = userIds[0]
    let activity = `SEED2-${type}-${i}`
    activities.push({
        activity: activity,
        accessibility: 1,
        type: type,
        participants: 1,
        progress: 100,
        owner: user,
        price: 2
    })
}

for (let i = 0; i < 20; i++) {
    let type = types[3]
    let user = userIds[1]
    let activity = `SEED2-${type}-${i}`
    activities.push({
        activity: activity,
        accessibility: 1,
        type: type,
        participants: 1,
        progress: 100,
        owner: user,
        price: 1
    })
}

for (let i = 0; i < 6; i++) {
    let type = types[4]
    let user = userIds[1]
    let activity = `SEED2-${type}-${i}`
    activities.push({
        activity: activity,
        accessibility: 1,
        type: type,
        participants: 1,
        progress: 100,
        owner: user,
        price: 0
    })
}

for (let i = 0; i < 20; i++) {
    let type = types[4]
    let user = userIds[2]
    let activity = `SEED2-${type}-${i}`
    activities.push({
        activity: activity,
        accessibility: 1,
        type: type,
        participants: 1,
        progress: 100,
        owner: user,
        price: 1
    })
}

mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        Activity.create(activities)
            .then(newActivities => {
                console.log('the new activities', newActivities)
                mongoose.connection.close()
            })
            .catch(error => {
                console.log(error)
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