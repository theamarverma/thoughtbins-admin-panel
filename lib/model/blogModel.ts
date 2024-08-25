import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	desc: {
		type: String,
		required: true,
	},
	time: {
		type: Date,
		required: true,
	},
	month: {
		type: String,
		required: true,
	},
	year: {
		type: Number,
		required: true,
	},
	content: [
		{
			title: {
				type: String,
				required: true,
			},
			description: {
				type: String,
				required: true,
			},
		},
	],
});

// Creating the Blog model

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
