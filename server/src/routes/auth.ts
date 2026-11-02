import { Router,  type Request, type Response, type NextFunction } from "express";
import rateLimit from "express-rate-limit";
import passport from "../config/passport.js";
import { UserModel } from "../models/user.js";
import { hashPassword } from "../utils/bcrypt.js";
import { genOTP } from "../utils/genOTP.js";
import { PendingUserModel } from "../models/pendingUser.js";
import { sendVerificationEmail } from "../utils/mailer.js";

const router: Router = Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: true,
    message: {
        error: "Too many log in attempts. Please try again after 15 minutes",
    },
});

const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many sign up attempts. Please try again later",
    }
});

const verifyCodeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many verification attempts. Please try again in 15 minutes",
    }
});

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

router.post('/login', loginLimiter, (req: Request, res: Response, next: NextFunction) => {
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

router.post('/signup', signupLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please provide an email and a password" })
        }

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        const hashedPassword = await hashPassword(password);

        if (!hashedPassword) {
            throw new Error("Error hashing password");
        }

        const verificationCode = genOTP();

        await PendingUserModel.findOneAndUpdate(
            { email },
            { email, password: hashedPassword, verificationCode, createdAt: new Date() },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
        );

        await sendVerificationEmail(email, verificationCode);

        return res.status(200).json({
            message: "Verification code sent to your email. Please check your inbox"
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/verify-code", verifyCodeLimiter, async(req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ error: "Email and verification code are required" });
        }

        const pendingRecord = await PendingUserModel.findOne({ email });

        if (!pendingRecord) {
            return res.status(400).json({ error: "Verification code expired or invalid request. Please sign up again" });
        }

        const OTP_TTL_MS = 10 * 60 * 1000;

        if (Date.now() - pendingRecord.createdAt.getTime() >= OTP_TTL_MS) {
            await PendingUserModel.deleteOne({ _id: pendingRecord._id });
            return res.status(400).json({
                error: "Verification code expired. Please sign up again",
            });
        }

        if (pendingRecord.verificationCode !== code) {
            return res.status(400).json({ error: "Invalid verification code" });
        }

        await UserModel.create({
            email: pendingRecord.email,
            password: pendingRecord.password,
        });

        await PendingUserModel.deleteOne({ _id: pendingRecord._id });

        return res.status(200).json({ message: "Email verified successfully, you can now log in" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post(
    '/logout', 
    (req: Request, res: Response, next: NextFunction) => {
        req.logOut((err) => {
            if (err) {
                return next(err)
            }

            req.session.destroy(() => {
                res.clearCookie("connect.sid");
                res.status(200).json({ message: "Logged out successfully" });
            });
        });
    }
);

export default router;