import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import groupRouter from './routes/groupRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import postRouter from './routes/postRouter.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 3001;
app.use('/user', userRouter);
app.use('/group', groupRouter);
app.use('/reviews', reviewRouter);
app.use('/posts', postRouter)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
});

app.listen(port,() => {
  console.log(`Server is running on http://localhost:${port}`);
});
