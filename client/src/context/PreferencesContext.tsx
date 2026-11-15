import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
    BACKGROUND_OPTIONS,
    FONT_OPTIONS,
    FONT_SIZE_OPTIONS,
    LINE_SPACING_OPTIONS,
    PREVIEW_LINES_OPTIONS,
} from "./preferencesOptions";

const THEME_KEY = "notes-app-theme";
const FONT_KEY = "notes-app-font";
const FONT_SIZE_KEY = "notes-app-font-size";
const PREVIEW_LINES_KEY = "notes-app-preview-lines";
const LINE_SPACING_KEY = "notes-app-line-spacing";
const BACKGROUND_KEY = "notes-app-background";

type Font = typeof FONT_OPTIONS[number]["value"];
type Background = typeof BACKGROUND_OPTIONS[number]["value"];

interface PreferencesContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
    font: Font;
    setFont: (font: Font) => void;
    fontSize: number;
    setFontSize: (fontSize: number) => void;
    previewLines: number;
    setPreviewLines: (lines: number) => void;
    lineSpacing: number;
    setLineSpacing: (spacing: number) => void;
    background: Background;
    setBackground: (background: Background) => void;
    resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

function isFont(value: string | null): value is Font {
    return FONT_OPTIONS.some((option) => option.value === value);
}

function isFontSize(value: number): value is number {
    return FONT_SIZE_OPTIONS.some((option) => option.value === value);
}

function isPreviewLines(value: number): value is number {
    return PREVIEW_LINES_OPTIONS.some((option) => option.value === value);
}

function isLineSpacing(value: number): value is number {
    return LINE_SPACING_OPTIONS.some((option) => option.value === value);
}

function isBackground(value: string | null): value is Background {
    return BACKGROUND_OPTIONS.some((option) => option.value === value);
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem(THEME_KEY) === "dark"
    );
    const [font, setFontState] = useState<Font>(() => {
        const savedFont = localStorage.getItem(FONT_KEY);
        return isFont(savedFont) ? savedFont : "system";
    });
    const [fontSize, setFontSizeState] = useState(() => {
        const savedFontSize = Number(localStorage.getItem(FONT_SIZE_KEY));
        return isFontSize(savedFontSize) ? savedFontSize : 20;
    });
    const [previewLines, setPreviewLinesState] = useState(() => {
        const savedLines = Number(localStorage.getItem(PREVIEW_LINES_KEY));
        return isPreviewLines(savedLines) ? savedLines : 3;
    });
    const [lineSpacing, setLineSpacingState] = useState(() => {
        const savedSpacing = Number(localStorage.getItem(LINE_SPACING_KEY));
        return isLineSpacing(savedSpacing) ? savedSpacing : 1.5;
    });
    const [background, setBackgroundState] = useState<Background>(() => {
        const savedBackground = localStorage.getItem(BACKGROUND_KEY);
        return isBackground(savedBackground) ? savedBackground : "illustrated";
    });

    useEffect(() => {
        document.documentElement.dataset.theme = darkMode ? "dark" : "light";
        localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
    }, [darkMode]);

    useEffect(() => {
        document.documentElement.dataset.font = font;
        localStorage.setItem(FONT_KEY, font);
    }, [font]);

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}px`;
        localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
    }, [fontSize]);

    useEffect(() => {
        document.documentElement.style.setProperty("--preview-line-count", String(previewLines));
        document.documentElement.dataset.previewLines = String(previewLines);
        localStorage.setItem(PREVIEW_LINES_KEY, String(previewLines));
    }, [previewLines]);

    useEffect(() => {
        document.documentElement.style.setProperty("--editor-line-height", String(lineSpacing));
        localStorage.setItem(LINE_SPACING_KEY, String(lineSpacing));
    }, [lineSpacing]);

    useEffect(() => {
        document.documentElement.dataset.background = background;
        localStorage.setItem(BACKGROUND_KEY, background);
    }, [background]);

    const toggleDarkMode = () => setDarkMode((enabled) => !enabled);
    const setFont = (nextFont: Font) => setFontState(nextFont);
    const setFontSize = (nextFontSize: number) => {
        if (isFontSize(nextFontSize)) setFontSizeState(nextFontSize);
    };
    const setPreviewLines = (nextLines: number) => {
        if (isPreviewLines(nextLines)) setPreviewLinesState(nextLines);
    };
    const setLineSpacing = (nextSpacing: number) => {
        if (isLineSpacing(nextSpacing)) setLineSpacingState(nextSpacing);
    };
    const setBackground = (nextBackground: Background) => setBackgroundState(nextBackground);
    const resetPreferences = () => {
        setDarkMode(false);
        setFontState("system");
        setFontSizeState(20);
        setPreviewLinesState(3);
        setLineSpacingState(1.5);
        setBackgroundState("illustrated");
    };

    return (
        <PreferencesContext.Provider
            value={{
                darkMode,
                toggleDarkMode,
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
            }}
        >
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error("usePreferences must be used within PreferencesProvider");
    }

    return context;
}
