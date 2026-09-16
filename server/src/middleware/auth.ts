import { type Request, type Response, type NextFunction } from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized, please log in" });
    }
    return next();
}