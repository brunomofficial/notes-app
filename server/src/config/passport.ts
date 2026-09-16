import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../models/user.js";
import { hashPassword, verifyPassword } from "../utils/bcrypt.js";

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email: string, password: string, done) => {
            try {
                const user = await UserModel.findOne({email});
                if (!user) {
                    return done(null, false, { message: "Invalid credentials" });
                }
                const isMatch = await verifyPassword(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: "Invalid credentials" });
                }
                return done(null, user);
            }
            catch (error) {
                console.log(error);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await UserModel.findById(id).select("-password");
        done(null, user)
    }
    catch (error) {
        done(error)
    }
});

export default passport;