const express = require('express')
const mongoose = require('mongoose')

//MIDDLEWARE

// jsonwebtoken docs: https://github.com/auth0/node-jsonwebtoken
const crypto = require('crypto')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')
// we will use 10 rounds of salting
const bcryptSaltRounds = 10
// custom errors --> we will use bad params and bad credentials
const errors = require('../../lib/custom_errors')
const BadParamsError = errors.BadParamsError
const BadCredentialsError = errors.BadCredentialsError

//user model
const User = require('../models/user')

const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// SIGN UP
// POST /sign-up
router.post('/sign-up', (req, res, next) => {
	Promise.resolve(req.body.credentials)
		// reject any requests where `credentials.password` is not present, or where
		// the password is an empty string
		.then((credentials) => {
			if (
				!credentials ||
				!credentials.password ||
				credentials.password !== credentials.password_confirmation
			) {
				throw new BadParamsError()
			}
		})
		// generate a hash from the provided password, returning a promise
		.then(() => bcrypt.hash(req.body.credentials.password, bcryptSaltRounds))
		.then((hash) => {
			// return necessary params to create a user
			return {
				username: req.body.credentials.username,
				email: req.body.credentials.email,
				createdDate:req.body.credentials.createdDate,
				avatar: req.body.credentials.avatar,
				hashedPassword: hash
			}
		})
		// create user with provided email and hashed password
		.then((user) => User.create(user))
		// send the new user object back with status 201, but `hashedPassword`
		// won't be send because of the `transform` in the User model
		.then((user) => res.status(201).json({ user: user.toObject() }))
		// pass any errors along to the error handler
		.catch(next)
})

// SIGN IN
// POST /sign-in
router.post('/sign-in', (req, res, next) => {
	const pw = req.body.credentials.password
	let user

	// find a user based on the email that was passed
	User.findOne({ email: req.body.credentials.email })
		.populate('buddies', ['email','username'])
		.then((record) => {
			// if we didn't find a user with that email, send 401
			if (!record) {
				throw new BadCredentialsError()
			}
			// save the found user outside the promise chain
			user = record
			// `bcrypt.compare` will return true if the result of hashing `pw`
			// is exactly equal to the hashed password stored in the DB
			return bcrypt.compare(pw, user.hashedPassword)
		})
		.then((correctPassword) => {
			// if the passwords matched
			if (correctPassword) {
				// the token will be a 16 byte random hex string
				const token = crypto.randomBytes(16).toString('hex')
				user.token = token
				// save the token to the DB as a property on user
				return user.save()
			} else {
				// throw an error to trigger the error handler and end the promise chain
				// this will send back 401 and a message about sending wrong parameters
				throw new BadCredentialsError()
			}
		})
		.then((user) => {
			// return status 201, the email, and the new token
			res.status(201).json({ user: user.toObject() })
		})
		.catch(next)
})

// CHANGE password
// PATCH /change-password
router.patch('/change-password', requireToken, (req, res, next) => {
	let user
	// `req.user` will be determined by decoding the token payload
	User.findById(req.user.id)
		// save user outside the promise chain
		.then((record) => {
			user = record
		})
		// check that the old password is correct
		.then(() => bcrypt.compare(req.body.passwords.old, user.hashedPassword))
		// `correctPassword` will be true if hashing the old password ends up the
		// same as `user.hashedPassword`
		.then((correctPassword) => {
			// throw an error if the new password is missing, an empty string,
			// or the old password was wrong
			if (!req.body.passwords.new || !correctPassword) {
				throw new BadParamsError()
			}
		})
		// hash the new password
		.then(() => bcrypt.hash(req.body.passwords.new, bcryptSaltRounds))
		.then((hash) => {
			// set and save the new hashed password in the DB
			user.hashedPassword = hash
			return user.save()
		})
		// respond with no content and status 200
		.then(() => res.sendStatus(204))
		// pass any errors along to the error handler
		.catch(next)
})

// UPDATE buddies
// PATCH /user/addbuddy // Camel case ?
router.patch('/user/addbuddy', requireToken, (req, res, next) => {
	const buddyId = req.body.buddyId
	//add the requesting buddy to the accepting user's buddies array
	User.findById(req.user.id)
		// save user outside the promise chain
		.then((user) => {
			user.buddies.push(buddyId)
			return user.save()
		})
		// pass any errors along to the error handler
		.catch(next)
	//add the accepting buddy to the requesting user's buddy array
	User.findById(buddyId)
		.then(user => {
			user.buddies.push(req.user.id)
			return user.save()
		})
		.then(() => res.sendStatus(200))
		.catch(next)
})

//UPDATE buddies --> remove buddies
//DELETE /user/:id1/:id2
router.patch('/user/removebuddy', requireToken, (req,res,next) => { // camel case ?
	//grab buddyId from data
	const buddyId = req.body.buddyId
	//grab id of requesting user
	const userId = req.user.id
	//remove the buddy from the requesting user's array
	User.findById(userId)
		.then(user => {
			//grab the buddy's index for splicing
			const index = user.buddies.indexOf(mongoose.Types.ObjectId(buddyId))
			//remove the buddy
			user.buddies.splice(index,1)
			return user.save()
		})
		.catch(next)
	//repeat process in other direction --> remove the user from the buddy's array
	User.findById(buddyId)
		.then(user => {
			const index = user.buddies.indexOf(mongoose.Types.ObjectId(userId))
			user.buddies.splice(index,1)
			return user.save()
		})
		.then(() => res.sendStatus(200))
		.catch(next)
})

router.delete('/sign-out', requireToken, (req, res, next) => {
	// create a new random token for the user, invalidating the current one
	req.user.token = crypto.randomBytes(16)
	// save the token and respond with 204
	req.user
		.save()
		.then(() => res.sendStatus(204))
		.catch(next)
})

//GET user buddies --> having this route is useful to compartmentalize the buddies component in the app 
//GET /user/buddies
router.get('/user/buddies', requireToken, (req,res,next) => {
	User.findById(req.user.id)
		.populate('buddies', ['email', 'username', 'avatar'])
		.then(user => res.status(200).json({buddies: user.buddies}))
		.catch(next)
})

//GET user info
//GET /uer/userID
router.get('/user/:userId', requireToken, (req,res,next) => {
	const { userId } = req.params
	User.findById(userId)
		.then(user => res.status(200).json({ user: {email: user.email, createdDate: user.createdDate, buddies: user.buddies, user: user, avatar:user.avatar} }))
		.catch(next)
})




module.exports = router
