import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ role }) {
  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/add-user', label: 'Add User' },
    { path: '/admin/user-listing', label: 'User Listing' },
    { path: '/admin/lead-management', label: 'Lead Management' },
    { path: '/admin/email-campaign', label: 'Email Campaign' },
    { path: '/admin/email-generator', label: 'Email Generator' },

  ];

  const userLinks = [
    { path: '/user/dashboard', label: 'Dashboard' },
    { path: '/user/lead-listing', label: 'Lead Listing' },
    { path: '/user/email-campaign', label: 'Email Campaign' },
    { path: '/user/email-generator', label: 'Email Generator' },

  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <div className="bg-gray-900 text-white w-64 h-screen p-4 fixed top-0 left-0">
      <h2 className="text-xl font-bold mb-6">{role === 'admin' ? 'Admin Panel' : 'User Panel'}</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `block p-2 rounded-lg ${isActive ? 'bg-blue-500' : 'hover:bg-gray-700'} transition`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;