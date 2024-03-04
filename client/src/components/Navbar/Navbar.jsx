import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProviders";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    function toggleMenu() {
        var menu = document.querySelector(".menu");
        menu.classList.toggle("active");
    }

    const handleLogout = () => {
        logOut()
            .then()
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="navbar">
            <div className="logo">
                <img src={logo} alt="Logo" />
                <ul className="menu">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {user && (
                        <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                    )}
                </ul>
            </div>
            <div className="menu-toggle" onClick={() => toggleMenu()}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div>
                {user ? (
                    <button onClick={handleLogout}>Sign Out</button>
                ) : (
                    <Link className="login-btn" to="/login">
                        Login/Register
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
