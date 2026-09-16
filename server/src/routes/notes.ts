import { Router,  type Request, type Response, type NextFunction } from "express";
import { requireAuth } from "../middleware/auth.js";
import { NoteModel } from "../models/note.js";

const router: Router = Router()

router.get(
    '/',
    requireAuth,
    async (req: Request, res: Response) => {
        try {
            const user = req.user as any; // to refractor later
            const notes = await NoteModel.find({ userId: user._id });
            res.json(notes);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
});

router.post(
    '/', 
    requireAuth,
    async (req: Request, res: Response) => {
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
});

export default router;