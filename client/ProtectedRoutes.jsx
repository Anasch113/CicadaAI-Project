import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { AuthContext } from "./src/providers/AuthProviders";

// eslint-disable-next-line react/prop-types
const ProtectedRoutes = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();
    console.log("private route user: ", user);

    if (loading) {
        return (
            <div
                style={{ width: "100vw", height: "75vh" }}
                className="d-flex justify-content-center align-items-center"
            >
                <Spinner></Spinner>
            </div>
        );
    }
    if (user) {
        return children;
    } else
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace={true}
            ></Navigate>
        );
};

export default ProtectedRoutes;
