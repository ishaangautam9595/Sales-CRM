import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

function AddUser() {
  const { token } = useContext(AuthContext);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
  const [error, setError] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5001/api/users`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewUser({ username: '', password: '', role: 'user' });
      setError('');
      alert('User created successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-4">Add User</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="p-3 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="p-3 border rounded-lg"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="p-3 border rounded-lg"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleCreateUser}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
        >
          Create User
        </button>
      </div>
    </div>
  );
}

export default AddUser;