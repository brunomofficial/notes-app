import { Link } from "react-router-dom";
import HomeIcon from "../../assets/icons/HomeIcon";
import NewIcon from "../../assets/icons/NewIcon";
import ProfileIcon from "../../assets/icons/ProfileIcon";
import "./Navbar.css"

export default function Navbar() {
    return (
        <nav className="navbar">
            <Link
                to="/notes/new"
                className="navlink"
                title="create new note"
            >
                <NewIcon size={30} />
            </Link>

            <Link
                to="/"
                className="navlink"
                title="home"
            >
                <HomeIcon size={30} />
            </Link>

            <Link
                to="/profile"
                className="navlink"
                title="profile page"
            >
                <ProfileIcon size={30} />
            </Link>
        </nav>
    );
}