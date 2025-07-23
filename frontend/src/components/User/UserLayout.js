import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import Sidebar from '../Common/Sidebar';

function UserLayout() {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar role="user" />
        <div className="ml-64 p-8 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserLayout;