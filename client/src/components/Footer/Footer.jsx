import "./Footer.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProviders";

const Footer = () => {
    const { user } = useContext(AuthContext);
    return (
        <footer className="footer-container">
            <div className="upper-container">
                <div className="left-container">
                    <img src={logo} />
                </div>
                <div className="right-container">
                    <ul>
                        <li>
                            <Link to="/" className="footer-btn">
                                Home
                            </Link>
                        </li>
                        {!user && (
                            <>
                                <li>
                                    <Link to="/login" className="footer-btn">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="footer-btn">
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                        <li>
                            <a href="#contact-us" className="footer-btn">
                                Contact Us
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <p className="text-center text-white bg-dark m-0 p-0">
                ©Cicada-Ai, All Rights Reserved.
            </p>
        </footer>
    );
};

export default Footer;
