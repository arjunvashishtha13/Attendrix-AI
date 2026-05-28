import React from "react";
import { useNavigate } from "react-router-dom";
import './ViewAttendanceP.css';

function ViewAttendance() {
  const navigate = useNavigate();

  const courses = [
    { code: "CHE101", name: "Chemical Engineering Basics" },
    { code: "CSE102", name: "Introduction to Programming" },
    { code: "ECE103", name: "Digital Circuits" },
  ];

  const handleCourseClick = (courseCode) => {
    navigate(`/courses/${courseCode}`);
  };

  return (
    <div className="view-attendance-page">
      <div className="container">
        <h1 className="heading">Courses</h1>
        <div className="course-list">
          {courses.map((course, index) => (
            <div
              key={index}
              className="course-item"
              onClick={() => handleCourseClick(course.code)}
            >
              <h2>{course.code}</h2>
              <p>{course.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewAttendance;
