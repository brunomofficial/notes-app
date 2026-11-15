export const FONT_OPTIONS = [
    { value: "inter", label: "Inter" },
    { value: "roboto", label: "Roboto" },
    { value: "lora", label: "Lora" },
    { value: "arial", label: "Arial" },
    { value: "system", label: "System default" },
    { value: "georgia", label: "Georgia" },
] as const;

export const FONT_SIZE_OPTIONS = [
    { value: 16, label: "Small" },
    { value: 18, label: "Medium" },
    { value: 20, label: "Default" },
] as const;

export const PREVIEW_LINES_OPTIONS = [
    { value: 2, label: "2 lines" },
    { value: 3, label: "3 lines" },
    { value: 4, label: "4 lines" },
] as const;

export const LINE_SPACING_OPTIONS = [
    { value: 1.35, label: "Compact" },
    { value: 1.5, label: "Comfortable" },
    { value: 1.7, label: "Spacious" },
] as const;

export const BACKGROUND_OPTIONS = [
    { value: "illustrated", label: "Illustrated" },
    { value: "gradient", label: "Soft gradient" },
    { value: "plain", label: "Plain" },
] as const;
