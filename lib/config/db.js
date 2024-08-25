const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// console.log('MONGODB_URI:', MONGODB_URI); // Debugging

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	);
}

const connectDB = async () => {
	try {
		await mongoose.connect(MONGODB_URI); // Removed outdated options
		console.log('Db connected successfully');
	} catch (error) {
		console.error('Error connecting to database', error);
		process.exit(1);
	}
};

module.exports = { connectDB };
