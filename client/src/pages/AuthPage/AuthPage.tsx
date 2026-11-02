import { useState, type MouseEvent } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { api } from "../../utils/api";
import "./AuthPage.css";

export default function AuthPage() {
    const navigate = useNavigate();
    const { setUser, setNotes, setGuestMode } = useApp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [mode, setMode] = useState("login");

    const handleGuestModeToggle = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setGuestMode(true);
        navigate("/");
    }

    const changeMode = (e: MouseEvent<HTMLSpanElement>, targetMode?: string) => {
        e.preventDefault();
        if (targetMode === "signup" || targetMode === "login") {
            setMode(targetMode)
        }
        else {
            setMode(mode === "login" ? "signup" : "login")
        }
    }

    const handleLogin = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!email && !password) {
            toast.error("Please provide an email and password");
            return;
        }
        if (!email) {
            toast.error("Please provide an email");
            return;
        }
        if (!password) {
            toast.error("Please provide a password");
            return;
        }

        toast.promise(
            login, {
            loading: "Logging in...",
            success: (data) => {
                setUser({
                    id: data.user._id,
                    email: data.user.email
                });
                console.log(data.user);
                return data.message;
            },
            error: (err) => err.message,
        }
        );
    }

    const login = async () => {
        const response = await api.post("/auth/login", { email, password });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Login failed, please try again");
        }

        const notesRes = await api.get("/notes");
        const notesData = await notesRes.json();

        if (!notesRes.ok) {
            throw new Error(notesData.error || "Failed to load notes");
        }

        setGuestMode(false);
        setNotes(notesData.notes);

        return data;
    }

    const handleSignup = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!email && !password && !passwordConfirmation) {
            toast.error("Please provide an email and password");
            return;
        }
        if (!email) {
            toast.error("Please provide an email");
            return;
        }
        if (!password) {
            toast.error("Please provide a password");
            return;
        }
        if (!passwordConfirmation) {
            toast.error("Please confirm your password");
            return;
        }
        if (password !== passwordConfirmation) {
            toast.error("Passwords don't match, please try again");
            return;
        }

        toast.promise(
            signup,
            {
                loading: "Creating account and sending code...",
                success: (data: any) => {
                    setMode("email-confirmation");
                    return data?.message
                },
                error: (err) => err.message,
            }
        );
    }

    const signup = async () => {
        const response = await api.post("/auth/signup", { email, password });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Sign up failed, please try again");
        }
        return data;
    }

    const handleVerifyCode = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!verificationCode) {
            toast.error("Please enter the verification code");
            return;
        }

        toast.promise(
            verifyCode, 
            {
                loading: "Verifying email",
                success: (data: any) => {
                    setMode("login");
                    return data.message;
                },
                error: (err: any) => err.message
            }
        )
    }

    const verifyCode = async () => {
        const response = await api.post("/auth/verify-code", { email, code: verificationCode });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Verification failed, please try again");
        }

        return data;
    }

    return (
        <div className="auth-page-container">
            <div className="auth-forms-container">
                <nav className="auth-nav">
                    <span 
                        className={`auth-mode-toggle ${mode === "login" ? "active" : ""}`}
                        onClick={(e) => changeMode(e, "login")}
                        title="Show login form"
                    >
                        Log in
                    </span>

                    <span
                        className={`auth-mode-toggle ${mode === "signup" ? "active" : ""}`}
                        onClick={(e) => changeMode(e, "signup")}
                        title="Show sign up form"
                    >
                        Sign up
                    </span>                
                </nav>

                {mode === "login" &&
                    <form className="login-form auth-form">
                        <h3>Welcome, please log in to continue</h3>
                        <div className="input-field">
                            <label htmlFor="emailInput">Enter your email</label>
                            <input
                                type="email"
                                name="loginEmailInput"
                                id="loginEmailInput"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-field">
                            <label htmlFor="loginPasswordInput">Enter your password</label>
                            <input
                                type="password"
                                name="loginPasswordInput"
                                id="loginPasswordInput"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="auth-buttons">
                            <button
                                className="login-btn"
                                onClick={handleLogin}
                            >
                                Log in
                            </button>

                            <button
                                className="guest-mode-btn"
                                onClick={handleGuestModeToggle}
                            >
                                Continue as Guest
                            </button>
                        </div>                  
                    </form>
                }

                {mode === "signup" &&
                    <form className="signup-form auth-form">
                        <h3>Welcome, please sign up to continue</h3>

                        <div className="input-field">
                            <label htmlFor="signupEmailInput">Enter your email</label>
                            <input
                                type="email"
                                name="signupEmailInput"
                                id="signupEmailInput"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-field">
                            <label htmlFor="signuPasswordInput">Enter your password</label>
                            <input
                                type="password"
                                name="signuPasswordInput"
                                id="signuPasswordInput"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-field">
                            <label htmlFor="passwordInputConfirmation">Confirm your password</label>
                            <input
                                type="password"
                                name="passwordInputConfirmation"
                                id="passwordInputConfirmation"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                            />
                        </div>

                        <div className="auth-buttons">
                            <button className="login-btn" onClick={handleSignup}>Sign up</button>

                            <button
                                className="guest-mode-btn"
                                onClick={handleGuestModeToggle}
                            >
                                Continue as Guest
                            </button>
                        </div>                  
                    </form>
                }

                {mode === "email-confirmation" && (
                    <form className="confirmation-form auth-form">
                        <h3>Enter confirmation code</h3>
                        <label htmlFor="">Verification code</label>
                        <input 
                            className="verification-code-input"
                            type="text" 
                            maxLength={6}
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />

                        <button onClick={handleVerifyCode} className="login-btn">Verify Account</button>

                        <a className="change-auth-mode-a" onClick={(e) => changeMode(e, "signup")}>
                            Back to Sign up
                        </a>
                    </form>
                )}
            </div>
        </div>
    );
}