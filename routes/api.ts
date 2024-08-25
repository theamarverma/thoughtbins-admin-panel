import { Blog } from '../lib/model/blogModel';
import multer from 'multer';
import path from 'path';
import express, { Request, Response } from 'express';
const api = express.Router();

// Set up multer for handling file uploads
const storage = multer.memoryStorage(); // Or configure disk storage
const upload = multer({ storage });

// Extend the Request interface to include multer properties
interface MulterRequest extends Request {
	file?: Express.Multer.File; // Use optional chaining if file might not be present
	// Adjust the type to match what multer sets for single file uploads
}

// Create a blog with file upload
api.post(
	'/',
	upload.single('image'),
	async (req: MulterRequest, res: Response) => {
		try {
			if (!req.file) {
				return res.json({
					success: false,
					msg: 'Image is required',
				});
			}
			//Image is sending to the database as base64
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
				content: parsedContent.map(
					(item: { title: string; description: string }) => ({
						title: item.title,
						description: item.description,
					})
				),
			};

			// Create the blog in the database
			const createdBlog = await Blog?.create(blogData);

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
	}
);

export default api;

// delete a blog
api.get('/', async (req, res) => {
	// console.log('Inside GET method for deletion...');

	try {
		const { id } = req.query;
		// console.log('Received ID:', id);

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

		// console.log('Blog deleted:', deletedBlog);
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

// get all blogs
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
