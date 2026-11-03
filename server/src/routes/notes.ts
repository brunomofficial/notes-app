import { Router,  type Request, type Response, type NextFunction } from "express";
import { requireAuth } from "../middleware/auth.js";
import { NoteModel, type Note } from "../models/note.js";

const MAX_NOTE_CHARS = 10_000;
const MAX_NOTES_PER_USER = 200;

const getNoteTextLength = (title: unknown, content: unknown): number => {
    return (typeof title === "string" ? title : "").length
        + (typeof content === "string" ? content : "").length
}

const router: Router = Router()

router.get(
    '/',
    requireAuth,
    async (req: Request, res: Response) => {
        try {
            const user = req.user as any; // to refractor later
            const notes = await NoteModel.find({ userId: user._id });
            const notesRes = notes.map(n => ({
                noteId: n._id,
                title: n.title,
                content: n.content,
                createdAt: n.createdAt,
                updatedAt: n.updatedAt,
            }));

            res.json({ notes: notesRes });

        }
        catch (error) {
            console.log(error);
            res.status(500).json("Internal server error");
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

            if (getNoteTextLength(title, content) > MAX_NOTE_CHARS) {
                // To move to custom middleware
                return res.status(413).json({
                    error: `Title and content must be total no more than ${MAX_NOTE_CHARS} characters`,
                });
            }

            const user = req.user as any;

            const noteCount = await NoteModel.countDocuments({ userId: user._id });

            if (noteCount >= MAX_NOTES_PER_USER) {
                return res.status(409).json({
                    error: `You can save upto ${MAX_NOTES_PER_USER} notes`,
                }); 
            }

            const note = await NoteModel.create({
                userId : user._id,
                title: title || null,
                content
            });
            res.status(201).json({ note: note });
        }
        catch (error) {
            console.log(error);
            res.status(500).json("Internal server error");
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

            if (getNoteTextLength(title, content) > MAX_NOTE_CHARS) {
                return res.status(413).json({
                    error: `Title and content must be a total no more than ${MAX_NOTE_CHARS} characters`,
                })
            }

            const user = req.user as any;
            const note = await NoteModel.findOneAndUpdate(
                { _id: noteId, userId: user._id },
                { title: title ?? "", content },
                { returnDocument: 'after' }
            );

            if (!note) {
                return res.status(404).json({ error: "Note not found or unauthorized" });
            }

            res.status(200).json({ note: note });
        }
        catch (error) {
            console.log(error);
            res.status(500).json("Internal server error");
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
            const note = await NoteModel.findOneAndDelete({
                _id: noteId,
                userId: user._id
            });

            if (!note) {
                return res.status(404).json({ error: "Note not found or unauthorized" });
            }

            res.status(200).json({
                message: "Note deleted successfully",
                noteId: note._id,
            })
        }
        catch (error) {
            console.log(error);
            res.status(500).json("Internal server error");
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

