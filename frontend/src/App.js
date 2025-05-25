
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard'; 
import AgentDashboard from './pages/AgentDashboard'; 
import AddAgent from './pages/AddAgent';
import ViewDistribution from './components/ViewDistributions';
import UploadList from './pages/UploadList';
import ProtectedRoute from './components/gProtectedRoute';
import MyTasks from './pages/MyTasks';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-agent"
            element={
              <ProtectedRoute role="admin">
                <AddAgent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-list"
            element={
              <ProtectedRoute role="admin">
                <UploadList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-distribution"
            element={
              <ProtectedRoute role="admin">
                <ViewDistribution />
              </ProtectedRoute>
            }
          />
<Route
  path="/agent/tasks"
  element={
    <ProtectedRoute>
      <MyTasks />
    </ProtectedRoute>
  }
/>

          {/* Agent Route */}
          <Route
            path="/agent/dashboard"
            element={
              <ProtectedRoute role="agent">
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
