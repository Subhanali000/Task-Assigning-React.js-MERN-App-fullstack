// frontend/src/pages/AddAgent.js
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './AddAgent.css';

const AddAgent = () => {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo?.token;

    if (!token) {
      alert('You must be logged in as admin to add an agent.');
      return;
    }

    try {
      await axios.post(`https://backend-task-management-app-35j9.onrender.com/api/agents/add`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Agent added!');
    } catch (err) {
      console.error('Add agent failed:', err.response?.data || err.message);
      alert('Failed to add agent');
    }
  };

  return (
    <div className="add-agent-container">
      <Navbar />
      <h2>Add Agent</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Mobile"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddAgent;
