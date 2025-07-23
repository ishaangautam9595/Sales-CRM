import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import Sidebar from '../Common/Sidebar';

function AdminLayout() {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" />
        <div className="ml-64 p-8 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;