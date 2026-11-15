import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import { usePreferences } from "../../context/PreferencesContext";
import {
    BACKGROUND_OPTIONS,
    FONT_OPTIONS,
    FONT_SIZE_OPTIONS,
    LINE_SPACING_OPTIONS,
    PREVIEW_LINES_OPTIONS,
} from "../../context/preferencesOptions";
import { useApp } from "../../context/AppContext";
import "./Settings.css";

export default function Settings() {
    const { notes } = useApp();
    const {
        font,
        setFont,
        fontSize,
        setFontSize,
        previewLines,
        setPreviewLines,
        lineSpacing,
        setLineSpacing,
        background,
        setBackground,
        resetPreferences,
    } = usePreferences();

    const exportNotes = () => {
        const notesFile = new Blob([JSON.stringify(notes, null, 2)], {
            type: "application/json",
        });
        const downloadUrl = URL.createObjectURL(notesFile);
        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = `notes-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(downloadUrl);
    };

    return (
        <div className="settings-page page">
            <h2>Settings</h2>

            <div className="settings-list">
                <div className="settings-row">
                    <div>
                        <h3>Theme</h3>
                        <p>Switch between light and dark mode.</p>
                    </div>
                    <ThemeToggle />
                </div>

                <label className="settings-row" htmlFor="font-selector">
                    <span>
                        <h3>Font</h3>
                        <p>Choose the font used throughout the app.</p>
                    </span>
                    <select
                        id="font-selector"
                        className="font-selector"
                        aria-label="Font"
                        value={font}
                        onChange={(event) => setFont(event.target.value as typeof font)}
                    >
                        {FONT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="settings-row" htmlFor="font-size-selector">
                    <span>
                        <h3>Font size</h3>
                        <p>Adjust the text size across the app.</p>
                    </span>
                    <select
                        id="font-size-selector"
                        className="font-selector"
                        aria-label="Font size"
                        value={fontSize}
                        onChange={(event) => setFontSize(Number(event.target.value))}
                    >
                        {FONT_SIZE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="settings-row" htmlFor="preview-lines-selector">
                    <span>
                        <h3>Preview line count</h3>
                        <p>Choose how much note content appears on the home page.</p>
                    </span>
                    <select
                        id="preview-lines-selector"
                        className="font-selector"
                        aria-label="Preview line count"
                        value={previewLines}
                        onChange={(event) => setPreviewLines(Number(event.target.value))}
                    >
                        {PREVIEW_LINES_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="settings-row" htmlFor="line-spacing-selector">
                    <span>
                        <h3>Editor line spacing</h3>
                        <p>Adjust the space between lines while editing notes.</p>
                    </span>
                    <select
                        id="line-spacing-selector"
                        className="font-selector"
                        aria-label="Editor line spacing"
                        value={lineSpacing}
                        onChange={(event) => setLineSpacing(Number(event.target.value))}
                    >
                        {LINE_SPACING_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="settings-row" htmlFor="background-selector">
                    <span>
                        <h3>Background style</h3>
                        <p>Choose the background treatment for the app.</p>
                    </span>
                    <select
                        id="background-selector"
                        className="font-selector"
                        aria-label="Background style"
                        value={background}
                        onChange={(event) => setBackground(event.target.value as typeof background)}
                    >
                        {BACKGROUND_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="settings-row settings-actions">
                    <button type="button" onClick={exportNotes} className="settings-action-btn">
                        Export notes
                    </button>
                    <button type="button" onClick={resetPreferences} className="settings-action-btn">
                        Reset preferences
                    </button>
                </div>
            </div>
        </div>
    );
}
