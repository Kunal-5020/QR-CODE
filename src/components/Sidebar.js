import React from 'react';
import { NavLink } from 'react-router-dom';
import './css/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/admin" end activeClassName="active-link">
              Welcome
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/add-vendor" activeClassName="active-link">
              Add Vendor
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/vendor-list" activeClassName="active-link">
              Vendor List
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
