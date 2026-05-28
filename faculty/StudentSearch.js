import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentSearch.css';

function StudentSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    event.preventDefault();
    const result = [
      { name: 'John Doe', id: 'S12345' },
      { name: 'Jane Smith', id: 'S67890' },
    ];
    setStudents(result);
  };

  const handleStudentClick = (studentId) => {
    navigate(`/studentprofile/${studentId}`);
  };

  return (
    <div className="search-container container-custom">
      <h2>Student Search</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="row mb-3">
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary btn-block">
              Search
            </button>
          </div>
        </div>
      </form>
      <div className="search-results">
        <ul className="list-group">
          {students.map((student, index) => (
            <li key={index} className="list-group-item" onClick={() => handleStudentClick(student.id)}>
              {student.name} - {student.id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StudentSearch;
