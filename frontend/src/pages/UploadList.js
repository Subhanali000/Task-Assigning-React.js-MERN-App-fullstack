import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './UploadList.css';

const UploadList = () => {
  const [file, setFile] = useState(null);
  const [note, setNote] = useState('');

  const uploadHandler = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('note', note); // Add note to the request

    try {
      await axios.post('https://task-assigning-react-js-mern-app-1i2j.onrender.com/api/lists/uploads', formData, {
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('List uploaded!');
      setFile(null);
      setNote('');
    } catch (err) {
      alert('Upload failed');
      console.error(err);
    }
  };

  return (
   <div className="upload-container">
  <Navbar />
  <h2>Upload CSV with Notes</h2>
  <form onSubmit={uploadHandler} className="upload-form">
    <div>
      <label>Select CSV File:</label>
      <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files[0])} />
    </div>
    <div>
      <label>Notes:</label><br />
      <textarea
        rows="4"
        cols="50"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write any notes for this upload..."
      />
    </div>
    <button type="submit">Upload</button>
  </form>
</div>
  );
};

export default UploadList;
