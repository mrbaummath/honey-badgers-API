const express = require('express')
const passport = require('passport')
const axios = require('axios')

// pull in Mongoose model for activity
const Activity = require('../models/activity')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
const { ObjectId } = require('mongodb')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

//custom functions
//function to count up completed activities of each type from a mongoose query giving an array of a user's activities
const countFinished = require('../../lib/count_finished')

// instantiate a router (mini app that only handles routes)
const router = express.Router()

///////////////////
// INDEX 
// GET (/activities)
//////////////////
router.get('/activities', (req, res, next) => {
    Activity.find()
    .populate('owner', 'email')
    .populate('notes.owner', 'email')
        .then(activities => {
            activities = activities.filter(activity => activity.private === false)
            return activities.map(activity => activity)
        })
        .then(activities => {
            res.status(200).json({ activities: activities })
        })
        .catch(next)
})


///////////////////
// SHOW MINE
// GET (/activities/mine)
//////////////////
//show all from current user
router.get('/activities/mine', requireToken, (req,res,next) => {

    Activity.find({'owner': req.user.id })
        .then(handle404)
        //give back all activities
        .then(activities => {
            const completedCounts = countFinished(activities)
            res.status(200).json({ activities: activities, completedCounts:completedCounts })
        })
        .catch(next)
})

///////////////////
// SHOW User's
// GET (/activities/user/:userID
//////////////////
router.get('/activities/user/:userId', requireToken, (req,res,next) => {
    Activity.find({'owner': req.params.userId })
        .then(handle404)
        .then(activities => {
            //filter out activities marked as private
            const publicActivities = activities.filter(activity => activity.private === false)
            //get completedCounts 
            const completedCounts = countFinished(activities)
            //return the public activities
            res.status(200).json({activities : publicActivities, completedCounts:completedCounts })
        })
        .catch(next)
})

///////////////////
// SHOW 
// GET (/activities/:id)
//////////////////
router.get('/activities/:id', requireToken, (req, res, next) => {
    Activity.findById(req.params.id)
    .populate('owner')
    .populate('notes.owner', 'email')
    .then(handle404)
    .then(activity => {
        let privateViewableNotes = activity.notes.filter((noteObj) => ((noteObj.owner.id == req.user.id)&&(noteObj.private === true)))
        privateViewableNotes = privateViewableNotes.map(noteObj => ({
            "text": noteObj.text,
            "author": noteObj.owner.email
        }))
        res.status(200).json({ activity: activity, publicNotes: activity.publicNotes, privateViewableNotes: privateViewableNotes })
    })
    .catch(next)
})


///////////////////
// CREATE
// POST (/activities)
//////////////////
router.post('/activities', requireToken, (req, res, next) => {
    req.body.activity.owner = req.user.id
    Activity.create(req.body.activity)
    .then(activity => {
        res.status(201).json({ activity: activity })
    })
    .catch(next)
})


///////////////////
// GET Random Activity
// SHOW (/activities/random)
//////////////////
router.get('/random', (req, res, next) => {
    console.log('get /activites/random')
    axios(`http://www.boredapi.com/api/activity`)
    .then( activity => {
        console.log(activity.data)
        res.send(activity.data)
    })
})


///////////////////
// UPDATE
// PATCH (/activities/:id)
//////////////////
router.patch('/activities/:id', requireToken, removeBlanks, (req, res, next) => {
    delete req.body.activity.owner

    Activity.findById(req.params.id)
        .then(handle404)
        .then(activity => {
            requireOwnership(req, activity)

        return activity.updateOne(req.body.activity)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})



///////////////////
// DESTROY
// DELETE (/activities/:id)
//////////////////
router.delete('/activities/:id', requireToken, (req, res, next) => {
    Activity.findById(req.params.id)
    .then(handle404)
    .then((activity) => {
        requireOwnership(req, activity)
        activity.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})



module.exports = router