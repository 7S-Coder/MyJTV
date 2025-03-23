import React from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar.jsx';

const Admin = () => {
  return (
    <main>
      <AdminNavbar />
      <h1>Admin Panel</h1>
      <Link to="/admin/launchstream">Go to Launch Stream</Link>
    </main>
  );
};

export default Admin;
