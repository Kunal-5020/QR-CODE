import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/WelcomePage.css';

const WelcomePage = () => {
  const [vendorCount, setVendorCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);

        // Fetch all vendors
        const response = await axios.get('http://localhost:5000/vendors');
        const vendors = response.data;

        // Calculate counts
        const totalVendors = vendors.length;
        const totalCustomers = vendors.reduce(
          (sum, vendor) => sum + (vendor.customer_data ? vendor.customer_data.length : 0),
          0
        );

        setVendorCount(totalVendors);
        setCustomerCount(totalCustomers);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="vendor-container">
      <h1>Welcome to the Admin Panel</h1>
      <p>Below is the summary of the system:</p>

      <div className="stats">
        <div className="stat-card">
          <h2>Total Vendors</h2>
          <p>{vendorCount}</p>
        </div>
        <div className="stat-card">
          <h2>Total Customers</h2>
          <p>{customerCount}</p>
        </div>
      </div>

    </div>
  );
};

export default WelcomePage;
