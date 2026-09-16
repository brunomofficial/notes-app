import express, {type Request, type Response, type NextFunction} from "express";
import mongoose from "mongoose"
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./config/passport.js";
import "dotenv/config";
import { UserModel } from './models/user.js'
import { NoteModel } from './models/note.js'
import { hashPassword, verifyPassword } from "./utils/bcrypt.js";

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

app.use(express.json())
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
)

app.use(passport.initialize())
app.use(passport.session())

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.error("MongoDB connection failed", err)
    })

app.get('/', (req: Request, res: Response) => {
    res.sendStatus(200);
})

app.post(
    '/api/auth/login', 
    passport.authenticate('local'),
    (req: Request, res: Response) => {
        res.status(200).json({
            message: "Logged in sucessfully",
            user: req.user
        })
    }
)

app.get('/api/auth/status', (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({
            isAuthenticated: true,
            user: req.user
        });
    }
    else {
        return res.status(401).json({
            isAuthenticated: false,
            user: null
        });
    }
})

app.post('/api/auth/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        res.status(200).json({ message: "Logged out successfully" })
    })
})

app.get('/api/users', async (req: Request, res: Response) => {
    const users = await UserModel.find();
    res.json(users);
})

app.post('/api/users', async (req: Request, res: Response) => {
    try { 
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide an email and a password" })
        }
        const hashedPassword = await hashPassword(password);
        if (!hashedPassword) {
            return res.sendStatus(500);
        }
        const user = await UserModel.create({
            email,
            password: hashedPassword
        });
        return res.status(201).json({ message: "Sign up successful, please log in to continue" })
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

app.get('/api/notes', async (req: Request, res: Response) => {
    //const userId = req.userId;
    // All notes for a specific user
    try {
        //const notes = await NoteModel.find({userId: userId})
    }
    catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
})

app.post('/api/notes', async (req: Request, res: Response) => {
    try {
        const { userId, title, content } = req.body;
        if (!userId) {
            return res.status(400).send({ error: "userId required" })
        }
        if (!content) {
            return res.status(400).send({ error: "Note content is required" })
        }
        const note = await NoteModel.create({
            userId,
            title,
            content
        });
        res.status(201).json(note);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})