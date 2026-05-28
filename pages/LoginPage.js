import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [choice, setChoice] = useState(null);

  const handleLoginClick = () => {
    navigate('/students');
  };
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Container className="login-form-container">
      <Row className="justify-content-center align-items-center h-100">
        <Col md={6} lg={4} className="login-form">
          <h2 className="text-center">Login</h2>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Enrollment Number</Form.Label>
              <Form.Control type="text" placeholder="Enter your number" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
              <i className="fa fa-eye toggle-password" onClick={togglePasswordVisibility}></i>
            </Form.Group>

            <Form.Group className="text-center">
              <Button variant="primary" type="submit" className="action-button" onClick={handleLoginClick}>
                Login
              </Button>
            </Form.Group>
            <div className="text-center">
              <div>Don't have an account</div>
              <a href="/register">Register here</a>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

const togglePasswordVisibility = (e) => {
  const passwordField = e.target.previousElementSibling;
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
  } else {
    passwordField.type = 'password';
  }
};

export default LoginPage;
