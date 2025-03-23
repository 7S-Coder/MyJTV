import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
            Admin
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/launchstream" className={({ isActive }) => (isActive ? 'active' : '')}>
            Stream
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
