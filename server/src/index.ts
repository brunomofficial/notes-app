import express, {type Request, type Response, type NextFunction} from "express";
import mongoose from "mongoose"
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./config/passport.js";
import "dotenv/config";
import usersRouter from "./routes/users.js";
import notesRouter from "./routes/notes.js";
import authRouter from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const MONGO_URI = process.env.MONGO_URI

if (Number.isNaN(PORT)) {
    throw new Error("PORT must be a valid number");
}

if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing from .env");
}

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is missing from .env");
}

app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: MONGO_URI,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 wk
        }
    }), 
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', usersRouter);
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
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
});