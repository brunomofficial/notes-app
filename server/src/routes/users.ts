import { Router,  type Request, type Response, type NextFunction } from "express";
import { UserModel } from "../models/user.js";
import { hashPassword } from "../utils/bcrypt.js";

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    // only for testing
    const users = await UserModel.find();
    res.json(users);
});

router.post('/', async (req: Request, res: Response) => {
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
});

export default router;