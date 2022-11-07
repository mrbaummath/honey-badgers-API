// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/

// import activity model --> notes are activity subbocs // PERFECT COMMENT
const Activity = require('../models/activity')

//MIDDLEWARE IMPORTS
const passport = require('passport')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireSubOrDocOwnership = customErrors.requireSubOrDocOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

//router creation
const router = express.Router()

//ROUTES --> indexing and showing are handled in the activity controllers 

// CREATE NEW NOTE --> any user can add a note to any activity they can see 
// POST /notes/<activity_Id>
router.post('/notes/:activityId', requireToken, (req, res, next) => { // awesome comments here 
    //store values from req.body
    const note = req.body.note
    //add ownership to note --> authors can edit/delete their messages 
    note.owner = req.user.id
    //grab activity idea from URL
	const activityId = req.params.activityId
    //grab the activity with the specified id
    Activity.findById(activityId)
        //handle case where there is no activity
        .then(handle404)
        //store new note in activity's notes field and save the activity
        .then((activity) => {
            activity.notes.push(note)
            return activity.save()
        })
        //send success created status along with json of the updated activity
        .then(activity => (res.status(201).json({ activity: activity })))
        .catch(next)
})

// UPDATE NOTE --> note's author can edit
// PATCH /notes/<activity_id>/<note_id>
router.patch('/notes/:activityId/:noteId', requireToken, removeBlanks, (req, res, next) => {
	//grab IDs from URL parameters
    const { activityId, noteId } = req.params
    //grab activity
	Activity.findById(activityId)
        //handle no activity
		.then(handle404)
		.then((activity) => {
			//grab note being altered from activity notes array
            const note = activity.notes.id(noteId)
            //check for ownership of the note
			requireOwnership(req, note)
            //set note with updated data
            note.set(req.body)
            //return saved activity
            return activity.save()
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY --> both note author and activity owner should be able to delete a note
// DELETE /notes/<activity_id>/<note_id>
router.delete('/notes/:activityId/:noteId', requireToken, (req, res, next) => {
    //grab activity and note Ids from URL params
    const { activityId, noteId } = req.params
	Activity.findById(activityId)
        //throw error if no activity
		.then(handle404)
		.then((activity) => {
            //grab note to delete
            const note = activity.notes.id(noteId)
			// throw an error if current user is neither the note's nor the activity's owner
			requireSubOrDocOwnership(req, note, activity)
			// delete the note ONLY IF the above didn't throw
			note.remove()
            //return saved activity
            return activity.save()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router
