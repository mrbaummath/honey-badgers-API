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

module.exports = mongoose.model('Note', noteSchema)
