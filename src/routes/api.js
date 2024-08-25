const multer = require('multer');
const path = require('path');
const express = require('express');
const { Blog } = require('../lib/model/blogModel');

const api = express.Router();

// Set up multer for handling file uploads
const storage = multer.memoryStorage(); // Or configure disk storage
const upload = multer({ storage });

// Create a blog with file upload
api.post('/', upload.single('image'), async (req, res) => {
	try {
		if (!req.file) {
			return res.json({
				success: false,
				msg: 'Image is required',
			});
		}
		// Image is sending to the database as base64
		// Handle the image
		const imgUrl = req.file.buffer.toString('base64'); // Example: if you want to use base64

		// Extract other fields
		const { title, desc, content } = req.body;

		if (!title || !desc || !content) {
			return res.json({
				success: false,
				msg: 'Title, description, and content are required',
			});
		}

		let parsedContent;
		try {
			parsedContent = JSON.parse(content);
		} catch (parseError) {
			return res.json({
				success: false,
				msg: 'Content is not valid JSON',
			});
		}

		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		const currentDate = new Date();
		const currentMonthName = monthNames[currentDate.getMonth()];
		const currentYear = currentDate.getFullYear();

		// Prepare blog data with nested headers
		const blogData = {
			title,
			image: imgUrl,
			desc,
			time: new Date(),
			month: currentMonthName,
			year: currentYear,
			content: parsedContent.map((item) => ({
				title: item.title,
				description: item.description,
			})),
		};

		// Create the blog in the database
		const createdBlog = await Blog.create(blogData);

		return res.json({
			success: true,
			msg: 'Blog created',
		});
	} catch (error) {
		console.error('Error creating blog:', error);
		return res.json({
			success: false,
			msg: 'Failed to create blog',
		});
	}
});

// Delete a blog
api.get('/', async (req, res) => {
	try {
		const { id } = req.query;

		if (!id) {
			return res.status(400).json({
				success: false,
				msg: 'ID is required',
			});
		}

		const deletedBlog = await Blog.findByIdAndDelete(id);

		if (!deletedBlog) {
			return res.status(404).json({
				success: false,
				msg: 'Blog not found',
			});
		}

		return res.status(200).json({
			success: true,
			msg: 'Blog deleted',
		});
	} catch (error) {
		console.error('Error deleting blog:', error);
		return res.status(500).json({
			success: false,
			msg: 'Failed to delete blog',
		});
	}
});

// Get all blogs
api.get('/all', async (req, res) => {
	try {
		const blogs = await Blog.find({});
		return res.json({
			success: true,
			blogs,
		});
	} catch (error) {
		console.error('Error fetching blogs:', error);
		return res.json({
			success: false,
			msg: 'Failed to fetch blogs',
		});
	}
});

module.exports = api;
