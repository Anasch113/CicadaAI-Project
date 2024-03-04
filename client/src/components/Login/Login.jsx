import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.css'
import { useState, useContext } from 'react';
import { AuthContext } from '../../providers/AuthProviders';

const Login = () => {
  const {logIn, signInWithGoogle } = useContext(AuthContext);
    const [error, setError] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const handleLogin = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
    
        console.log(email, password);
        setError("");
        logIn(email, password)
          .then((result) => {
            const loggedUser = result.user;
            console.log(loggedUser);
            navigate(from, { replace: true });
          })
          .catch((err) => {
            console.log(err);
            setError("Login Failed! Please, Try Again!");
          });
      };


      const handleSignInWithGoogle = () => {
        signInWithGoogle()
          .then((result) => {
            const loggedInUser = result.user;
            console.log(loggedInUser);
            navigate(from, { replace: true });
          })
          .catch((error) => {
            console.log(error);
          });
      };


    
  return (
    <div>
    <Container className='py-5'>
      <Row>
        <Col md={6}>
         <div className='p-5'>
         <div className='m-5 mx-auto'>
         <img src="https://imgs.bharatmatrimony.com/bmimgs/login/login-otp-banner.png" alt="Login" className="img-fluid" />
         </div>
         </div>
        </Col>
        <Col md={6}>
          <div className='p-5 outer-container'>
          <div className='inner-container'>
          <h1 className='text-left my-4'>Login</h1>
          <Form onSubmit={handleLogin} className='mt-2'>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className='mt-3'>Email address</Form.Label>
              <Form.Control type="email" name='email' placeholder="Enter email" required/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className='mt-3'>Password</Form.Label>
              <Form.Control type="password" name='password' placeholder="Password" required/>
            </Form.Group>

            <Button className='mt-3' variant="secondary" type="submit">
              Login
            </Button>
            <br />
            {error && <Form.Text className="mt-3 text-danger text-right">{error}</Form.Text>}
            <br />

            <Button onClick={handleSignInWithGoogle} variant="light" className="mt-3">
              <i className='fab fa-google me-2 text-primary'></i>
            Sign in with Google
            </Button>

            
          </Form>
          <p className='mt-3'>New to Here? Please <Link className='text-success fs-3' to='/register'>Register</Link> </p>
          </div>
          </div>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Login;
<p className='mt-3'>New to Here? Please <Link className='text-success fs-3' to='/register'>Register</Link> </p>