"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Import the CORS package
const db_1 = require("./lib/config/db");
const app = (0, express_1.default)();
// Parse the request body to JSON
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files from the public directory
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Enable CORS to allow requests from the frontend running on http://localhost:3000
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers from the frontend
}));
// API routes
app.use('/api', require('./routes/api'));
// Connect to the database
const MONGODB_URI = process.env.MONGODB_URI;
app.get('/', (req, res) => {
    res.send('Hello World');
});
// Server listening and connecting to the database
const port = process.env.PORT || 9000; // Use port 9000 as your backend
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await (0, db_1.connectDB)();
});
