import express, { type Express, type Request, type Response, type NextFunction, urlencoded} from "express";
import mongoose from "mongoose"
import session from "express-session";
import { MongoStore } from "connect-mongo";
import passport from "./config/passport.js";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";
import notesRouter from "./routes/notes.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app: Express = express();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing from .env");
}

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is missing from .env");
}

app.set("trust proxy", 2);

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
}));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        proxy: true,
        store: MongoStore.create({
            mongoUrl: MONGO_URI,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 wk
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        },
    }), 
);

const MAX_REQUESTS = 1000;
const WINDOW_MINS = 15;

const globaLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: true,
    message: {
        error: `Too many requests, please try again after ${WINDOW_MINS} minutes`,
        status: 429,
    }
});

app.use(globaLimiter);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/notes', notesRouter);
app.use('/api/auth', authRouter);

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.error("MongoDB connection failed", err)
    });

app.get('/', (req: Request, res: Response) => {
    console.log(req.ip);
    res.status(200).json({ message: "API is running" });
});

export default app;
