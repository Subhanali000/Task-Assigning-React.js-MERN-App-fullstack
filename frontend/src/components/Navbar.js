// frontend/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const logout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        

        {user?.role === 'admin' && (
          <>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/add-agent">Add Agent</Link></li>
            <li><Link to="/upload-list">Upload List</Link></li>
            <li><Link to="/view-distribution">View Distribution</Link></li>
          </>
        )}

        {user?.role === 'agent' && (
          <>
            <li><Link to="/agent/tasks">My Tasks</Link></li>
            <li><Link to="/agent/dashboard">Dasboard</Link></li>
          </>
        )}

        <li><button onClick={logout} className="logout-btn">Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
