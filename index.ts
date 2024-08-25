import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors'; // Import the CORS package
import { connectDB } from './lib/config/db';

const app = express();

// Parse the request body to JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS to allow requests from the frontend running on http://localhost:3000
app.use(
	cors({
		origin: 'http://localhost:3000', // Allow requests from this origin
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
		allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers from the frontend
	})
);

// API routes
app.use('/api', require('./routes/api'));

// Connect to the database
const MONGODB_URI = process.env.MONGODB_URI;

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World');
});

// Server listening and connecting to the database
const port = process.env.PORT || 9000; // Use port 9000 as your backend
app.listen(port, async () => {
	console.log(`Server is running on port ${port}`);
	await connectDB();
});
