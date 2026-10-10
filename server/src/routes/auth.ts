import { Router,  type Request, type Response, type NextFunction } from "express";
import passport from "../config/passport.js";
import { requireAuth } from "../middleware/auth.js";

const router: Router = Router();

router.get('/status', (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        const user = req.user as any
        return res.status(200).json({
            isAuthenticated: true,
            user: {
                _id: user._id,
                email: user.email,
            }
        });
    }
    else {
        return res.status(401).json({
            isAuthenticated: false,
            user: null
        });
    }
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                error: info?.message || "Invalid credentials"
            })
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({
                message: "Logged in successfully",
                user: {
                    _id: user._id,
                    email: user.email,
                }
            });
        });
    }) (req, res, next);
});

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