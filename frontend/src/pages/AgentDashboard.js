import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './AgentDashboard.css';

const AgentDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [agentInfo, setAgentInfo] = useState(null);

  useEffect(() => {
    const fetchAgentTasks = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;

      try {
   
        const res = await axios.get(`https://backend-task-management-app-35j9.onrender.com/api/lists/agent-details`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAgentInfo(res.data.agentInfo);
        setTasks(res.data.tasks || []);

      } catch (err) {
        console.error('Failed to fetch details:', err);
        alert('Could not load dasboard');
      }
    };

    fetchAgentTasks();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="agent-info">
        <h2>My Profile</h2>
        {agentInfo && (
          <ul>
            <li><strong>Name:</strong> {agentInfo.name}</li>
            <li><strong>Email:</strong> {agentInfo.email}</li>
            <li><strong>Phone:</strong> {agentInfo.phone}</li>
            <li><strong>Joining Date:</strong> {new Date(agentInfo.joiningDate).toLocaleDateString()}</li>
            <li><strong>Tasks Assigned:</strong> {tasks.length}</li>
          </ul>
        )}
      </div>

     
    </div>
  );
};

export default AgentDashboard;
