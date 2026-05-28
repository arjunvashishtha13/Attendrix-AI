import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Card, ProgressBar } from 'react-bootstrap';
import './CourseDetails.css';

const CourseDetails = () => {
  const location = useLocation();
  const { courseName, courseCode } = location.state || {};

  if (!courseName || !courseCode) {
    return <div>No course data found.</div>;
  }

  const totalClasses = 30;
  const studentAttendance = {
    'John Doe': 80,
    'Jane Smith': 90,
  };
  const classAverageAttendance = 85;

  return (
    <Container className="course-details-container">
      <h2 className="text-center">Course Details</h2>
      <Card>
        <Card.Header>
          <h3>{courseName} - {courseCode}</h3>
        </Card.Header>
        <Card.Body>
          <h5>Total Lecture Count:</h5>
          <p>The total lecture count for the course is {totalClasses}.</p>

          <h5>Student Attendance Percentage:</h5>
          <p>
            <strong>John Doe's Attendance:</strong>
            <ProgressBar now={studentAttendance['John Doe']} label={`${studentAttendance['John Doe']}%`} />
            <br />
          </p>

          <h5>Average Attendance of the Class:</h5>
          <p>
            The average attendance percentage of the class is {classAverageAttendance}%.
            <br />
            <ProgressBar now={classAverageAttendance} label={`${classAverageAttendance}%`} />
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CourseDetails;
