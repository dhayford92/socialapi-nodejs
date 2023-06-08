import express from 'express';
import userRouter from './routers/users.js';
import { connectDb } from './db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

//middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())

//include routers
app.use('/api/user', userRouter)


//starterengine
app.listen(8000, async ()=>{
    console.log('Server listening on http://localhost:8000');
    await connectDb();
    
});