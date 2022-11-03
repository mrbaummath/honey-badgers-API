const mongoose = require('mongoose')

//import activity model to be used for virtual processing
const Activity = require('./activity')

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
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
		createdDate: {
			type: String,
			required: false,
			unique: false,
		},
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
