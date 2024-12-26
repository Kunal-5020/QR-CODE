import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormPage from './components/FormPage';
import AdminPage from './components/Admin';
import AddVendor from './components/Admin/addVender';

import VendorList from './components/Admin/venderList';
import VendorProfile from './components/Admin/VenderProfile';
import WelcomePage from './components/Admin/WelcomePage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<FormPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
          
              <AdminPage />
            
          }
        >
          <Route index element={<WelcomePage />} />
          <Route path="add-vendor" element={<AddVendor />} />
          <Route path="vendor-list" element={<VendorList />} />
          <Route path="vendor-profile/:vendorId" element={<VendorProfile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
