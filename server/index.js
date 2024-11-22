import dotenv from 'dotenv';
import express from 'express'
import cors from 'cors'
import userRouter from './routes/userRouter.js';
import reviewRouter from './routes/reviewRouter.js';

dotenv.config();

const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:  false}))

const port = 3001
app.use('/user', userRouter)
app.use('/reviews', reviewRouter)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({error: err.message})
})
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

app.listen(port)