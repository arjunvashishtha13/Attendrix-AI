import React from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import './ViewAttendance.css';
import { useNavigate } from 'react-router-dom';

const ViewAttendance = () => {
  const navigate = useNavigate();

  const handleViewDetails = (courseName, courseCode) => {
    navigate('/course-details', { state: { courseName, courseCode } });
  };

  return (
    <Container className="attendance-container">
      <Row className="justify-content-center align-items-start">
        <Col md={4} className="profile-column">
          <div className="profile-header text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Student"
              className="profile-pic"
            />
          </div>
        </Col>
        <Col md={8} className="details-column">
          <div className="student-details-container">
            <h2 className="student-name">John Doe</h2>
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

      <h3 className="courses-title text-center mt-4">Courses Enrolled</h3>
      <Table striped bordered hover className="courses-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CS101</td>
            <td>Introduction to Computer Science</td>
            <td>
              <Button variant="primary" onClick={() => handleViewDetails('Introduction to Computer Science', 'CS101')}>View Details</Button>
            </td>
          </tr>
          <tr>
            <td>CS102</td>
            <td>Data Structures</td>
            <td>
              <Button variant="primary" onClick={() => handleViewDetails('Data Structures', 'CS102')}>View Details</Button>
            </td>
          </tr>
          <tr>
            <td>CS103</td>
            <td>Algorithms</td>
            <td>
              <Button variant="primary" onClick={() => handleViewDetails('Algorithms', 'CS103')}>View Details</Button>
            </td>
          </tr>
          <tr>
            <td>CS104</td>
            <td>Operating Systems</td>
            <td>
              <Button variant="primary" onClick={() => handleViewDetails('Operating Systems', 'CS104')}>View Details</Button>
            </td>
          </tr>
          <tr>
            <td>CS105</td>
            <td>Database Systems</td>
            <td>
              <Button variant="primary" onClick={() => handleViewDetails('Database Systems', 'CS105')}>View Details</Button>
            </td>
          </tr>
          <tr>
            <td>CS106</td>
            <td>Computer Networks</td>
            <td>
              <Button variant="primary" onClick={() => handleViewDetails('Computer Networks', 'CS106')}>View Details</Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default ViewAttendance;
