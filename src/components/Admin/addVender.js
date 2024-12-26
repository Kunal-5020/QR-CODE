import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is installed with `npm install axios`
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import '../css/AddVendor.css';

const AddVendor = () => {
  const [vendorData, setVendorData] = useState({
    vendorName: '',
    phone: '',
    shopLocation: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vendorDataFormatted = {
      vendor_name: vendorData.vendorName,
      vendor_phone: vendorData.phone,
      vendor_shoplocation: vendorData.shopLocation,
    };

    try {
      const response = await axios.post('http://localhost:5000/vendor', vendorDataFormatted);
      
      // Retrieve vendor ID from response
      const vendorId = response.data.vendor._id;

      // Navigate to the vendor's profile page
      navigate(`/admin/vendor-profile/${vendorId}`); // This will navigate to the vendor profile page
    } catch (error) {
      console.error('Error adding vendor:', error);
      alert('Failed to add vendor');
    }
  };

  return (
    <div className="vendor-container">
      <h2>Add New Vendor</h2>
      <form onSubmit={handleSubmit} className="add-vendor-form">
        <div className="form-field">
          <label htmlFor="vendorName">Vendor Name</label>
          <input
            type="text"
            id="vendorName"
            name="vendorName"
            value={vendorData.vendorName}
            onChange={handleChange}
            placeholder="Enter vendor name"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={vendorData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="shopLocation">Shop Location</label>
          <input
            type="text"
            id="shopLocation"
            name="shopLocation"
            value={vendorData.shopLocation}
            onChange={handleChange}
            placeholder="Enter shop location"
            required
          />
        </div>
        <button type="submit" className="submit-button">Add Vendor</button>
      </form>
    </div>
  );
};

export default AddVendor;
