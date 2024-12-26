import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all vendors from the backend
    const fetchVendors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/vendors');
        setVendors(response.data);  // Store the vendor data in the state
      } catch (err) {
        setError('Error fetching vendors');  // Set an error message if the request fails
      } finally {
        setLoading(false);  // Set loading to false after the request is complete
      }
    };

    fetchVendors();  // Call the function to fetch vendors
  }, []);  // Empty dependency array ensures this effect runs only once when the component mounts

  // Filter vendors based on search term
  const filteredVendors = vendors.filter((vendor) => {
    const regex = new RegExp(searchTerm, 'i'); // Create a case-insensitive regex from searchTerm
    return (
      vendor.vendor_name.match(regex) ||
      vendor.vendor_phone.match(regex) ||
      vendor.vendor_shoplocation.match(regex)
    );
  });

  if (loading) return <p>Loading vendors...</p>;  // Show a loading message while fetching
  if (error) return <p>{error}</p>;  // Show an error message if there's a problem

  return (
    <div className="vendor-container">
      <h2>Vendors</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Vendors..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  // Update search term on input change
        className="search-input"
      />

      <table className="vendor-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Profile</th>
          </tr>
        </thead>
        <tbody>
          {filteredVendors.map((vendor) => (
            <tr key={vendor._id}>
              <td>{vendor.vendor_name}</td>
              <td>{vendor.vendor_phone}</td>
              <td>{vendor.vendor_shoplocation}</td>
              <td>
                <Link to={`http://localhost:3000/admin/vendor-profile/${vendor._id}`}>View Profile</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorList;
