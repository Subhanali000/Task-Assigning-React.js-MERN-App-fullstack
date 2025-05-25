// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
const API_URL = process.env.REACT_APP_API_URL;
  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password }, { withCredentials: true });

    const token = res.data.token;

    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT
    const userData = {
      token,
      role: decoded.role,
      email: decoded.email,
      name: decoded.name, // include more if needed
    };

    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
