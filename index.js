require('dotenv').config(); // Load environment variables from .env file

const path = require('path');
const express = require('express');
const cors = require('cors'); // Import the CORS package
const { connectDB } = require('./lib/config/db');

const app = express();

// Parse the request body to JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS to allow requests from the frontend running on http://localhost:3000
app.use(
	cors({
		origin: 'https://thoughtbins-admin.vercel.app', // Allow requests from this origin
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
		allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers from the frontend
	})
);

// API routes
app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
	res.send('Hello World');
});

// Server listening and connecting to the database
const port = process.env.PORT || 9000; // Use port 9000 as your backend
app.listen(port, async () => {
	console.log(`Server is running on port ${port}`);
	await connectDB();
});
