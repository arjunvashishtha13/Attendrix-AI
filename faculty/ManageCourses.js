import React, { useState } from 'react';
import './ManageCourses.css';

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');

  const handleAddCourse = (event) => {
    event.preventDefault();
    if (courseName && courseCode) {
      const newCourse = { name: courseName, code: courseCode };
      setCourses([...courses, newCourse]);
      setCourseName('');
      setCourseCode('');
    }
  };

  const handleRemoveCourse = (courseCode) => {
    setCourses(courses.filter(course => course.code !== courseCode));
  };

  return (
    <div className="container-custom page-container">
      <h2>Manage Courses</h2>
      <form onSubmit={handleAddCourse} className="mb-4">
        <div className="row mb-3">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Course Code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary btn-block">
              Add Course
            </button>
          </div>
        </div>
      </form>
      <h3>Added Courses</h3>
      <ul className="list-group">
        {courses.map((course, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {course.name} ({course.code})
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleRemoveCourse(course.code)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageCourses;
