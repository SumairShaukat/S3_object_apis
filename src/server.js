import express from 'express';
import dotenv from 'dotenv';
import uploadRoutes from './routes/s3Uploadroutes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests (if needed)
app.use(express.json());

// Use upload routes
app.use('/api', uploadRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send({ message: 'Welcome' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
