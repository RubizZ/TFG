import express from 'express';
import { connectDB } from './config/database.js';
import { RegisterRoutes } from '../build/routes.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

connectDB();

RegisterRoutes(app)

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});