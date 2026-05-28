import React from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css';

function Profile() {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossOrigin="anonymous"></script>

      <div className="profile-container container">
        <div className="profile-info text-center mb-4">
          <img
            src="https://th.bing.com/th/id/OIP.hAU1PMP-me5pux99qoyszgHaJw?w=139&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt="Profile"
            className="profile-picture img-fluid"
          />
          <h2 className="mt-3">Name: Sumana Ghosh</h2>
          <p>Email: sumana_g@ch.iitr.ac.in</p>
          <p>Employee ID: EMP12345</p>
        </div>

        <div className="container mt-4">
          <div className="row text-center">
            <div className="col-md-3 mb-3">
              <button className="btn btn-custom" onClick={() => navigate('/applyattendance')}>
                Apply Attendance
              </button>
            </div>
            <div className="col-md-3 mb-3">
              <button className="btn btn-custom" onClick={() => navigate('/faculty/viewattendanceP')}>
                View Attendance
              </button>
            </div>
            <div className="col-md-3 mb-3">
              <button className="btn btn-custom" onClick={() => navigate('/courses')}>
                Courses
              </button>
            </div>
            <div className="col-md-3 mb-3">
              <button className="btn btn-custom" onClick={() => navigate('/search')}>
                Search Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
