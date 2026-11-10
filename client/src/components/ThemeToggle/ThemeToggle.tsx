import { useApp } from "../../context/AppContext";
import ThemeIcon from "../../assets/icons/ThemeIcon";
import "./ThemeToggle.css";

export default function ThemeToggle() {
    const { darkMode, toggleDarkMode } = useApp();

    return (
        <button
            className="theme-toggle"
            type="button"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
            <ThemeIcon darkMode={darkMode} />
        </button>
    );
}
