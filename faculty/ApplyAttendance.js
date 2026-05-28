import React, { useState } from 'react';
import './ApplyAttendance.css';

function ApplyAttendance() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Photo uploaded successfully!');
        setFile(null);
      } else {
        alert('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo');
    }
  };

  return (
    <div className="upload-container container-custom">
      <h2>Upload Attendance Photo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary-custom"
        >
          Upload Photo
        </button>
      </form>
    </div>
  );
}

export default ApplyAttendance;
