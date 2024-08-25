import mongoose from 'mongoose';

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

// console.log('MONGODB_URI:', MONGODB_URI); // Debugging

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	);
}

export const connectDB = async (): Promise<void> => {
	try {
		await mongoose.connect(MONGODB_URI); // Removed outdated options
		console.log('Db connected successfully');
	} catch (error) {
		console.error('Error connecting to database', error);
		process.exit(1);
	}
};
