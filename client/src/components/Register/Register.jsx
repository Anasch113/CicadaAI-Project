import { useState, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProviders";
import "./Register.css";

const Register = () => {
    const { user, createUser } = useContext(AuthContext);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setError("");
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;

        console.log(name, email, password);

        if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
            setError("Please add at least two uppercase");
            return;
        } else if (!/(?=.*[0-9])/.test(password)) {
            setError("Please add at least one digits");
            return;
        } else if (password.length < 6) {
            setError("Please add at least 6 character in your password");
            return;
        }
        try {
            await createUser(email, password, name);
            console.log(user);
            navigate("/dashboard");
        } catch (err) {
            console.log(err);
            setError(err.message);
        }
    };

    return (
        <div className="py-5">
            <Container className="my-5 px-5">
                <Row className="my-5 p-2">
                    <Col md={6} className="image-section">
                        <img
                            src="https://png.pngtree.com/png-vector/20220525/ourmid/pngtree-online-registration-or-sign-up-login-for-account-on-smartphone-app-png-image_4740865.png"
                            alt="Registration"
                            className="img-fluid"
                        />
                    </Col>
                    <Col md={6} className="form-section">
                        <h1 className="mt-3">Create an Account</h1>
                        <Form onSubmit={handleRegister}>
                            <Form.Group controlId="name">
                                <Form.Label className="mt-3">Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Your Name"
                                    name="name"
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label className="mt-3">Email:</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter Your Email"
                                    name="email"
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label className="mt-3">
                                    Password:
                                </Form.Label>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter Your Password"
                                    name="password"
                                    required
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleTogglePassword}
                                    className="mt-2"
                                >
                                    {showPassword
                                        ? "Hide Password"
                                        : "Show Password"}
                                </Button>
                            </Form.Group>
                            <Button
                                className="mt-3"
                                variant="danger"
                                type="submit"
                            >
                                Register
                            </Button>
                            <br />
                            <p className="text-danger">{error}</p>
                            <p></p>
                            <p className="mt-3">
                                Already have an account?{" "}
                                <Link className="fs-3 text-success" to="/login">
                                    Login
                                </Link>{" "}
                            </p>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;
