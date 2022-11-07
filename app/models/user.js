const mongoose = require('mongoose')

//import activity model to be used for virtual processing < good comment
const Activity = require('./activity') // unused import, should be in a V2 branch if you plan on using it.

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			// required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		hashedPassword: {
			type: String,
			required: true,
		},
		avatar: {
			type: String, 
			required: true,
			default: 'https://i.imgur.com/uEW4fPX.png' // good use of default 
		},
		createdDate: {
			type: String,
			required: false,
			unique: false, // unique is false by default 
		},
		buddies: [{ // good use of many to many ! 
			type : mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}],
		token: String,
	},
	{
		timestamps: true,
		toObject: {
			// remove `hashedPassword` field when we call `.toObject`
			transform: (_doc, user) => {
				delete user.hashedPassword
				return user
			},
			
		},
		toJSON: {
			//removed hashed password
			transform: (_doc, user) => {
				delete user.hashedPassword
				return user
			},
			
		}
	}
)


module.exports = mongoose.model('User', userSchema)
