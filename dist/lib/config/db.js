"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGODB_URI;
// console.log('MONGODB_URI:', MONGODB_URI); // Debugging
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(MONGODB_URI); // Removed outdated options
        console.log('Db connected successfully');
    }
    catch (error) {
        console.error('Error connecting to database', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
