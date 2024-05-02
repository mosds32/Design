import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express()
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECERT
}))

app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json({
    limit:"16kb"
}));

app.use(express.urlencoded({
    limit:'16kb',
    extended: true
}));
app.use(express.static('public'));

app.use(cookieParser());

import AuthRouter from './routes/auth.routes.js';
app.use('/api/v1/auth', AuthRouter);

import ProfileRouter from './routes/profile.routes.js';
app.use('/api/v1/profile', ProfileRouter);

import TrainerRoute from './routes/usertrainer.routes.js';
app.use('/api/v1/trainer', TrainerRoute);

import VideoRoute from './routes/video.routes.js';
app.use('/api/v1/video', VideoRoute);

import CourseRoute from './routes/usercourse.routes.js';
app.use('/api/v1/course', CourseRoute);

import ReviewsRoute from './routes/reviews.routes.js';
app.use('/api/v1/review', ReviewsRoute);


export {app};