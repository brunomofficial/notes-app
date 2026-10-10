import { Link } from "react-router-dom";
import HomeIcon from "../icons/HomeIcon";
import NewIcon from "../icons/NewIcon";
import ProfileIcon from "../icons/ProfileIcon";
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