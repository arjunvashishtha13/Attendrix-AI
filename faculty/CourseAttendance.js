import React, { useState } from 'react';
import './CourseAttendance.css';
import { useNavigate } from 'react-router-dom';

function CourseAttendance() {
  const [totalLectures, setTotalLectures] = useState(30);
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Smith', enrollmentNo: 'CHE10123', attendance: 25 },
    { id: 2, name: 'Bob Johnson', enrollmentNo: 'CHE10124', attendance: 20 },
    { id: 3, name: 'Charlie Brown', enrollmentNo: 'CHE10125', attendance: 22 },
  ]);
  const navigate = useNavigate();

  const handleIncreaseAttendance = (studentId) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? { ...student, attendance: student.attendance + 1 }
          : student
      )
    );
  };

  const handleViewDetails = () => {
    navigate('/search');
  };

  return (
    <div className="course-attendance-page">
      <div className="container">
        <h1 className="heading">Course Attendance</h1>
        <div className="dropdown-container mb-4">
          <select className="form-select">
            <option>Select Branch</option>
            <option value="CHE">Chemical Engineering</option>
            <option value="CSE">Computer Science Engineering</option>
            <option value="ECE">Electrical and Communication Engineering</option>
          </select>
        </div>
        <div className="attendance-info">
          <h2>Total Lectures: {totalLectures}</h2>
          <div className="students-list">
            {students.map((student) => {
              const attendancePercentage = ((student.attendance / totalLectures) * 100).toFixed(2);
              return (
                <div key={student.id} className="student-item">
                  <h3>{student.name} ({student.enrollmentNo})</h3>
                  <p>Total Attendance: {student.attendance}</p>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${attendancePercentage}%` }}
                      aria-valuenow={attendancePercentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {attendancePercentage}%
                    </div>
                  </div>
                  <button
                    className="btn btn-success mt-2"
                    onClick={() => handleIncreaseAttendance(student.id)}
                  >
                    Increase Attendance
                  </button>
                  <button
                    className="btn btn-info mt-2"
                    onClick={handleViewDetails}
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseAttendance;
