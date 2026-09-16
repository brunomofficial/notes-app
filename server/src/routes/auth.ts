import { Router,  type Request, type Response, type NextFunction } from "express";
import passport from "../config/passport.js";
import { requireAuth } from "../middleware/auth.js";

const router: Router = Router();

router.get('/status', (req: Request, res: Response) => {
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
});

router.post(
    '/login', 
    passport.authenticate('local'),
    (req: Request, res: Response) => {
        res.status(200).json({
            message: "Logged in sucessfully",
            user: req.user
        })
    }
);

router.post(
    '/logout', 
    requireAuth,
    (req: Request, res: Response, next: NextFunction) => {
        req.logOut((err) => {
            if (err) {
                return next(err)
            }
            res.status(200).json({ message: "Logged out successfully" })
        })
    }
);

export default router