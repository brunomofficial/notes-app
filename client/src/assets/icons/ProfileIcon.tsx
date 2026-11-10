interface ProfileIconProps {
    darkMode?: boolean;
    size?: number;
}

export default function ProfileIcon({ darkMode = false, size = 40 }: ProfileIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={`${size}px`}
            height={`${size}px`}
            viewBox="0 0 24 24"
            fill="none"
            stroke={darkMode ? "#ffffff" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
