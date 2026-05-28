import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './RegisterPage.css';

const RegisterPage = () => {
  return (
    <Container className="register-container">
      <Row className="justify-content-center align-items-center h-100">
        <Col md={6} lg={4} className="register-form">
          <h2 className="text-center">Register</h2>
          <Form>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter your username" />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
              <i className="fa fa-eye toggle-password" onClick={togglePasswordVisibility}></i>
            </Form.Group>

            <Form.Group className="text-center">
              <Button variant="primary" type="submit">
                Register
              </Button>
            </Form.Group>
            <div className="text-center">
              <a href="/login">Already have an account? Login here</a>
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

export default RegisterPage;
