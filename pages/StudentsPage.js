import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './StudentsPage.css';

const StudentPage = () => {
  return (
    <Container className="student-container">
      <Row className="justify-content-center align-items-start">
        <Col md={8} lg={6} className="student-profile">
          <div className="profile-header text-center">
            <img src="https://th.bing.com/th?id=OIP.YO2rFDoBlrWNm2k2cv6yfgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.4&pid=3.1&rm=2" alt="Student" className="profile-pic" />
            <h2 className="student-name">John Doe</h2>
            <div className="profile-actions text-center">
              <Button variant="primary" className="action-button" href="/ViewAttendance">View Attendance</Button>
              <Button variant="secondary" className="action-button" href="/query">Query</Button>
            </div>
            <p className="student-details">
              Enrollment Number: 123456 <br />
              Semester: 4 <br />
              Year: 2024 <br />
              Email: johndoe@example.com <br />
              Branch: Computer Science
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentPage;
