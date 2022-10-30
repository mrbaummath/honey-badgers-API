const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		private: {
			type: Boolean,
			required: true,
			default: false
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = noteSchema
