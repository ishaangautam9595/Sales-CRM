import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function UserDashboard() {
  const { role } = useContext(AuthContext);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-4">User Dashboard</h2>
      <p className="text-gray-600">Welcome, {role}!</p>
      <p className="text-gray-600">Use the sidebar to view your assigned leads.</p>
    </div>
  );
}

export default UserDashboard;