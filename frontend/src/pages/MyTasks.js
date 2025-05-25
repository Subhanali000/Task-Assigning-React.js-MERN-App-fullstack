import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './MyTasks.css';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

      try {
        const res = await axios.get('https://task-assigning-react-js-mern-app-1i2j.onrender.com/api/lists/my-tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data.tasks || res.data); // Adjust based on backend structure
      } catch (err) {
        alert('Failed to fetch tasks');
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="task-container">
        <h2>My Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks assigned.</p>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>File</th>
                
                <th>Assigned Date</th>
                <th>Notes</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx ) => (
                
                <tr key={idx}>
                  <td>{task.fileName}</td>
                  
                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td>{task.notes || '—'}</td>
                  <td>
                    <button onClick={() => alert(JSON.stringify(task, null, 2))}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
