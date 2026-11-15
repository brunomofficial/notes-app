import { usePreferences } from "../../context/PreferencesContext";
import ThemeIcon from "../../assets/icons/ThemeIcon";
import "./ThemeToggle.css";

export default function ThemeToggle() {
    const { darkMode, toggleDarkMode } = usePreferences();

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
