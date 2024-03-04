import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./ContactForm.css";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform your form submission logic here
        console.log(formData);
        // Reset the form
        setFormData({
            name: "",
            email: "",
            message: "",
        });
    };

    return (
        <div id="contact-us" className="contact-form-container">
            <Container>
                <h1 className="text-center mt-5">Send a message</h1>
                <p className="text-center mb-5">
                    If you want to discuss anything related to your account, or
                    our product, send us a message.
                </p>
                <Row className="col-container">
                    <Col md={6}>
                        <div
                            className="form-container mt-5"
                            data-aos="flip-right"
                            data-aos-duration="2000"
                        >
                            <h2 className="text-center">Send A Message!</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Message:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Button
                                    className="btn btn-warning mt-3"
                                    type="submit"
                                >
                                    Send
                                </Button>
                            </Form>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="picture-container">
                            <img
                                src="https://cdni.iconscout.com/illustration/premium/thumb/contact-us-5795988-4849052.png?f=webp"
                                alt="Contact"
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ContactForm;
