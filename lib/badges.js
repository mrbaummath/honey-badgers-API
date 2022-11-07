const countFinished = require('./count_finished')
// Lovely ! 
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
                badge = {'name':type, 'level': 'novice'}
                break
            case (finishedCounts[type] >= 10 && finishedCounts[type] < 15):
                badge = {'name':type, 'level': 'junior'}
                break
            case finishedCounts[type] >= 15 && finishedCounts[type] < 20:
                badge = {'name':type, 'level': 'master'}
                break
            case finishedCounts[type] >= 20:
                badge = {'name':type, 'level': 'expert'}
                break
            default:
                badge = {'name':type, 'level': 'none'}
            
        }
        badges.push(badge)
    })

    return badges
}

module.exports = badges