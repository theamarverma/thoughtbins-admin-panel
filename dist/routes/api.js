"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blogModel_1 = require("../lib/model/blogModel");
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const api = express_1.default.Router();
// Set up multer for handling file uploads
const storage = multer_1.default.memoryStorage(); // Or configure disk storage
const upload = (0, multer_1.default)({ storage });
// Create a blog with file upload
api.post('/', upload.single('image'), async (req, res) => {
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
        }
        catch (parseError) {
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
        const createdBlog = await blogModel_1.Blog?.create(blogData);
        return res.json({
            success: true,
            msg: 'Blog created',
        });
    }
    catch (error) {
        console.error('Error creating blog:', error);
        return res.json({
            success: false,
            msg: 'Failed to create blog',
        });
    }
});
exports.default = api;
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
        const deletedBlog = await blogModel_1.Blog.findByIdAndDelete(id);
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
    }
    catch (error) {
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
        const blogs = await blogModel_1.Blog.find({});
        return res.json({
            success: true,
            blogs,
        });
    }
    catch (error) {
        console.error('Error fetching blogs:', error);
        return res.json({
            success: false,
            msg: 'Failed to fetch blogs',
        });
    }
});
module.exports = api;
