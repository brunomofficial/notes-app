interface EyeIconProps {
    darkMode?: boolean;
    size?: number;
    visible?: boolean;
}

export default function EyeIcon({ darkMode = false, size = 24, visible = false }: EyeIconProps) {
    const stroke = darkMode ? "#ffffff" : "currentColor";

    return (
        <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width={`${size}px`}
            height={`${size}px`}
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {visible ? (
                <>
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                    <circle cx="12" cy="12" r="3" />
                </>
            ) : (
                <>
                    <path d="m3 3 18 18" />
                    <path d="M10.584 10.587a2 2 0 0 0 2.829 2.828" />
                    <path d="M9.363 5.365A10.7 10.7 0 0 1 12 5c5 0 8.73 3.11 10.438 6.412a1.8 1.8 0 0 1 0 1.176 11.5 11.5 0 0 1-2.157 3.205" />
                    <path d="M6.228 6.228A11.5 11.5 0 0 0 1.562 11.41a1.8 1.8 0 0 0 0 1.176C3.27 15.89 7 19 12 19a10.7 10.7 0 0 0 2.637-.365" />
                </>
            )}
        </svg>
    );
}
