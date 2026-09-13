import express, {type Request, type Response, type NextFunction} from "express";
import "dotenv/config";
import mongoose from "mongoose"

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const MONGO_URI = process.env.MONGO_URI

if (Number.isNaN(PORT)) {
    throw new Error("PORT must be a valid number")
}

if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing from .env")
}

app.use(express.json())

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.error("MongoDB connection failed", err)
    })

app.get('/', (req: Request, res: Response) => {
    res.send("hello from notes app")
})

app.get('/api/users', (req: Request, res: Response) => {
    
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})