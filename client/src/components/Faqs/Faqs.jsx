import { Container, Row, Col, Accordion } from "react-bootstrap";
import "./Faqs.css";
import "aos/dist/aos.css"; // Make sure to create and import the CSS file

const Faqs = () => {
    return (
        <div className="faq-container">
            <Container>
                <h1 className="text-center mt-5">Frequently Asked Questions</h1>
                <p className="text-center mb-5">
                    Have questions? Check out our frequently asked questions to
                    find answers.
                </p>
                <Row className="col-container">
                    <Col md={6}>
                        <div className="picture-container">
                            <img
                                src="https://englishunite.com/wp-content/uploads/2022/03/Faq_banner-image.png"
                                alt="FAQ"
                                className="img-fluid faq-image"
                            />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="border-2"  data-aos="flip-left"
                            data-aos-duration="2000">
                        <Accordion
                            defaultActiveKey="0"
                        >
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    How do I dictate my notes?
                                </Accordion.Header>
                                <Accordion.Body>
                                    You can dictate naturally without worrying
                                    about punctuations or periods. Our software
                                    will take care of all the appropriate
                                    punctuations and formatting.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    Is your website secure?
                                </Accordion.Header>
                                <Accordion.Body>
                                    Yes, we use secure connection with
                                    encryption of data at rest as well as in
                                    transit.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>
                                    How do I transfer my notes to my EMR?
                                </Accordion.Header>
                                <Accordion.Body>
                                    We provide a one-click copy function which
                                    will help you easily copy and paste your
                                    formatted note to EMR of your choice
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                                <Accordion.Header>
                                    How do I transfer my notes to my EMR?
                                </Accordion.Header>
                                <Accordion.Body>
                                    We provide a one-click copy function which
                                    will help you easily copy and paste your
                                    formatted note to EMR of your choice
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Faqs;
