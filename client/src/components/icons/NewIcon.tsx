interface NewIconProps {
    darkMode?: boolean;
    size?: number;
}

export default function NewIcon({ darkMode = false, size = 40 }: NewIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={`${size}px`}
            height={`${size}px`}
            viewBox="0 0 24 24"
            fill="none"
            stroke={darkMode ? "#ffffff" : "#000000"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}