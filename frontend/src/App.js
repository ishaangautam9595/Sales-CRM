import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/Auth/Login';
import AdminSignup from './components/Auth/AdminSignup';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/AdminDashboard';
import AddUser from './components/Admin/AddUsers';
import UserListing from './components/Admin/UserListing';
import LeadManagement from './components/Admin/LeadManagement';
import UserLayout from './components/User/UserLayout';
import UserDashboard from './components/User/UserDashboard';
import LeadListing from './components/User/LeadListing';
import ErrorBoundary from './components/Common/ErrorBoundary';
import './App.css';
import EmailCampaign from './components/Common/EmailCampaign';
import AdminEmailGenerator from './components/Admin/AdminEmailGenerator';
import UserEmailGenerator from './components/User/UserEmailGenerator';

function App() {
  const { token, role, isAdminRegistered } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {!token ? (
          <>
            <Route path="/login" element={<Login />} />            
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : role === 'admin' ? (
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
            <Route path="add-user" element={<ErrorBoundary><AddUser /></ErrorBoundary>} />
            <Route path="user-listing" element={<ErrorBoundary><UserListing /></ErrorBoundary>} />
            <Route path="lead-management" element={<ErrorBoundary><LeadManagement /></ErrorBoundary>} />
             <Route path="email-campaign" element={<ErrorBoundary><EmailCampaign role="admin" /></ErrorBoundary>} />
             <Route path="email-generator" element={<ErrorBoundary><AdminEmailGenerator /></ErrorBoundary>} />
            <Route index element={<Navigate to="dashboard" />} />
          </Route>
        ) : (
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<ErrorBoundary><UserDashboard /></ErrorBoundary>} />
            <Route path="lead-listing" element={<ErrorBoundary><LeadListing /></ErrorBoundary>} />
              <Route path="email-campaign" element={<ErrorBoundary><EmailCampaign role="user" /></ErrorBoundary>} />
              <Route path="email-generator" element={<ErrorBoundary><UserEmailGenerator  /></ErrorBoundary>} />
            <Route index element={<Navigate to="dashboard" />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to={role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} />} />
      </Routes>
    </div>
  );
}

export default App;