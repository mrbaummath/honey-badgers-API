const countFinished = require('./count_finished')

const badges = (activities) => {
    const types = ['education', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork', 'recreation']
    const badges = []
    const finishedCounts = countFinished(activities)
    types.forEach(type => {
        let badge = {'name':type, 'level': 'none'}
        
        switch(true) {
            case finishedCounts[type] < 5:
                badge = {'name':type, 'level': 'none'}
                break
            case (finishedCounts[type] >= 5 && finishedCounts[type] < 10):
                badge = {'name':type, 'level': 'Bronze'}
                break
            case (finishedCounts[type] >= 10 && finishedCounts[type] < 15):
                badge = {'name':type, 'level': 'Silver'}
                break
            case finishedCounts[type] >= 15:
                badge = {'name':type, 'level': 'Gold'}
                break
            default:
                badge = {'name':type, 'level': 'none'}
            
        }
        badges.push(badge)
    })

    return badges
}

module.exports = badges