//function which takes an activity array and returns an object counting up how many activities of each type have been completed
// spelling v
//the expectation is that this will be called in a mongoose query looking for all activities of a specific user, so the "activities" parameters is an array of activities owned by a specific user

// good comments and code organization 

const countFinished = (activities) => { 
    //initiate object to track how many activities of each type the user has completed
    let completedCounts = {}
    //array of all types of activities
    const types = ['education', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork', 'recreation']
    //set completion to 0 for each type
    types.forEach(type => completedCounts[type] = 0)
    //filter out completed activities from array and store
    const completedActivities = activities.filter(activity => activity.progress === 100)
    //loop through completed activities to count up each category
    completedActivities.forEach(activity => completedCounts[activity.type] += 1)
    return completedCounts
}

module.exports = countFinished