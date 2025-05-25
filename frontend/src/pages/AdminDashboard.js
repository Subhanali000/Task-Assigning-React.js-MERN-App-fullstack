import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const ViewAgents = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;

      if (!token) {
        console.warn('Token not found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/agents/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAgents(response.data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="view-agents-container">
  <Navbar />
  <h2>Agent List</h2>
  <table className="agents-table">
    <thead>
      <tr>
        <th>SN</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Joining Date</th>
      </tr>
    </thead>
    <tbody>
      {agents.map((agent, index) => (
        <tr key={agent._id}>
          <td>{index + 1}</td>
          <td>{agent.name}</td>
          <td>{agent.email}</td>
          <td>{agent.mobile}</td>
          <td>{new Date(agent.joinedAt).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


  );
};

export default ViewAgents;
