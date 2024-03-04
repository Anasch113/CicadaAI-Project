import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import AuthProviders from "./providers/AuthProviders.jsx";
import History from "./components/History/History.jsx";
import ProtectedRoutes from "../ProtectedRoutes.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/dashboard",
                element: <ProtectedRoutes><Dashboard /></ProtectedRoutes>,
            },
            {
                path: "/history",
                element: <ProtectedRoutes><History/></ProtectedRoutes>,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProviders>
            <RouterProvider router={router} />
        </AuthProviders>
    </React.StrictMode>
);
