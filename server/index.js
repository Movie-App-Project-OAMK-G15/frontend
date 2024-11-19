import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import groupRouter from './routes/groupRouter.js';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.json({ limit: '50mb' }));  // Adjust limit if necessary
// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Resolve the __dirname equivalent for ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = 3001;
app.use('/user', userRouter);
app.use('/group', groupRouter);
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
