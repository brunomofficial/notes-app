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
    }
);

router.post(
    '/', 
    requireAuth,
    async (req: Request, res: Response) => {
        try {
            const { title, content } = req.body;
            if (!content) {
                return res.status(400).send({ error: "Note content is required" })
            }
            const user = req.user as any;
            const note = await NoteModel.create({
                userId : user._id,
                title,
                content
            });
            res.status(201).json(note);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
);

router.put(
    '/:noteId',
    requireAuth,
    async (req: Request, res: Response) => {
        try {
            const { noteId } = req.params;
            const { title, content } = req.body;
            if (!content) {
                return res.status(400).json({ error: "Note content is required" });
            }
            const user = req.user as any;
            const updatedNote = await NoteModel.findOneAndUpdate(
                { _id: noteId, userId: user._id },
                { title: title ?? "", content },
                { returnDocument: 'after' }
            );
            if (!updatedNote) {
                return res.status(404).json({ error: "Note not found or unauthorized" });
            }
            res.status(200).json(updatedNote);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        } 
    }
);

router.delete(
    '/:noteId',
    requireAuth,
    async (req: Request, res: Response) => {
        try { 
            const { noteId } = req.params;
            const user = req.user as any;
            const deletedNote = await NoteModel.findOneAndDelete({
                _id: noteId,
                userId: user._id
            });
            if (!deletedNote) {
                return res.status(404).json({ error: "Note not found or unauthorized" });
            }
            res.status(200).json({
                message: "Note deleted successfully",
                deletedNoteId: deletedNote._id,
            })
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
)

export default router;

/*
  {
    "_id": "6aaa567ec283416693cb8c96",
    "userId": "6aaa516fab5d61652b622125",
    "title": "title",
    "content": "hello",
    "createdAt": "2026-09-16T08:42:38.212Z",
    "updatedAt": "2026-09-16T08:42:38.212Z",
    "__v": 0
  },
*/