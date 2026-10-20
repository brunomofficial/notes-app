import { useState, type ReactElement, type ReactEventHandler, type ReactNode } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext";
import { api } from "../../utils/api";
import "./AuthPage.css";

export default function AuthPage() {
    const { setUser } = useApp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [mode, setMode] = useState("login");
    
    const changeMode = (e) => {
        e.preventDefault();
        mode === "login" ? setMode("signup") : setMode("login");
    }

    const handleLogin = async (e) => {
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
                    setUser(data.user);
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
        return data;
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!email && !password && !passwordConfirmation) {
            toast.error("Please provide an email and confirm password");
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
                loading: "Creating account...",
                success: (data) => {
                    setMode("login");
                    return data.message
                },
                error: (err) => err.message,
            }
        );    
    }

    const signup = async () => {
        const response = await api.post("/users", { email, password });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Sign up failed, please try again");
        }
        return data;
    }
       
    return(
        <div className="auth-page-container">
            <div className="auth-forms-container">
                {mode === "login" &&
                    <form
                        className="login-form auth-form"
                    >
                        <h3>Welcome, please log in to continue</h3>
                        <label htmlFor="emailInput">Enter your email</label>
                        <input
                            type="email"
                            name="loginEmailInput"
                            id="loginEmailInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="loginPasswordInput">Enter your password</label>
                        <input
                            type="password"
                            name="loginPasswordInput"
                            id="loginPasswordInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button className="login-btn" onClick={handleLogin}>Log in</button>
                        <a
                            className="change-auth-mode-a"
                            onClick={changeMode}
                        >
                            Don't have an account? Sign up instead
                        </a>
                    </form>
                }

                {mode === "signup" &&
                    <form
                        className="signup-form auth-form"
                    >
                        <h3>Welcome, please sign up to continue</h3>
                        <label htmlFor="signupEmailInput">Enter your email</label>
                        <input
                            type="email"
                            name="signupEmailInput"
                            id="signupEmailInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="signuPasswordInput">Enter your password</label>
                        <input
                            type="password"
                            name="signuPasswordInput"
                            id="signuPasswordInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="passwordInputConfirmation">Confirm your password</label>
                        <input
                            type="password"
                            name="passwordInputConfirmation"
                            id="passwordInputConfirmation"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                        />
                        <button className="login-btn" onClick={handleSignup}>Sign up</button>
                        <a
                            className="change-auth-mode-a"
                            onClick={changeMode}
                        >
                            Have an account? Log in instead
                        </a>
                    </form>
                }
            </div>
        </div>
    );
}