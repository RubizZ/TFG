import express from 'express';
import { connectDB } from './config/database.js';
import { User } from './models/user.model.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

connectDB();

app.post("/users", async (req, res) => {
    const user = await User.create(req.body);
    res.json(user);
})

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});