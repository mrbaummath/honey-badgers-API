const countFinished = require('./count_finished')

const badges = (activities) => {
    const types = ['education', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork']
    const badges = {}
    const finishedCounts = countFinished(activities)
    types.forEach(type => {
        let badge = 'none'
        switch(true) {
            case finishedCounts[type] < 5:
                badge = 'none' 
                break
            case (finishedCounts[type] >= 5 && finishedCounts[type] < 10):
                badge = 'bronze'
                break
            case (finishedCounts[type] >= 10 && finishedCounts[type] < 15):
                badge = 'silver'
                break
            case finishedCounts[type] >= 15:
                badge = 'gold'
                break
            default:
                badge = 'none'
            
        }
        badges[type] = badge
    })

    return badges
}

module.exports = badges