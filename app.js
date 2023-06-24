import express from 'express';
import userRouter from './apps/user/router.js';
import postRouter from './apps/post/routers/posts.js';
import { connectDb } from './db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';


const app = express();

//middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload())

//include routers
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)


//starterengine
app.listen(8000, async ()=>{
    console.log('Server listening on http://localhost:8000');
    await connectDb();
});