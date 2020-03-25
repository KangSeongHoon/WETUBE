import "./init";

import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import helmel from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import path from "path";
import mongoStore from "connect-mongo";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouter";
import routes from "./routes"
import { localMiddleware } from "./middlewares";

dotenv.config();

const app = express();


const CokieSotore = mongoStore(session)

app.set('view engine', "pug");


//서버가 유저로부터 데이터를 받은 형식
app.use(helmel());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CokieSotore({ mongooseConnection: mongoose.connection })
})
);

app.use(passport.initialize());
app.use(passport.session());


app.use(localMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.video, videoRouter);
app.use(routes.api, apiRouter);

export default app;