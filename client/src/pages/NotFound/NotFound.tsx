import { useNavigate } from "react-router-dom";
import './NotFound.css'

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <p>Page not found</p>
            <button 
                className="back-to-home-btn"
                onClick={() => navigate('/')}
            >
                Back to Home Page
            </button>
        </div>
    );
}