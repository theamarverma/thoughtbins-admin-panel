import express, { Request, Response } from 'express';
import { Blog } from '../lib/model/blogModel';

const api = express.Router();

//create a blog
api.post('/', async (req: Request, res: Response) => {
	try {
		const data = await req.body;
		// console.log('data:......................', data);

		const image = data.image;
		if (!image) {
			return res.json({
				success: false,
				msg: 'Image is required',
			});
		}

		const imgUrl = image; // Adjust if processing base64 or URL
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
			title: data.title,
			image: imgUrl,
			desc: data.desc,
			time: new Date(),
			month: currentMonthName,
			year: currentYear,
			content: data.content.map(
				(item: { title: string; description: string }) => ({
					title: item.title,
					description: item.description,
				})
			),
		};

		// Create the blog in the database
		const createdBlog = await Blog?.create(blogData);

		// console.log('Blog created:', createdBlog);
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
