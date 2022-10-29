const mongoose = require('mongoose')

//import activity model to be used for virtual processing
const Activity = require('./activity')

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		hashedPassword: {
			type: String,
			required: true,
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
			virtuals: true
		},
		toJSON: {
			//removed hashed password
			transform: (_doc, user) => {
				delete user.hashedPassword
				return user
			},
			virtuals: true
		}
	}
)

//VIRTUALS to help display relevant accomplishment and associations on the client side
//completed tasks per 



module.exports = mongoose.model('User', userSchema)
