import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './css/FormPage.css';
import axios from 'axios';

const FormPage = () => {
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') || 'General'; // Get target from URL or default to 'General'

  const [vendorName, setVendorName] = useState(null); // State to hold vendor name
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [successMessage, setSuccessMessage] = useState(''); // Success message state
  const [formSubmitted, setFormSubmitted] = useState(false); // State to track if form was submitted

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    target,
  });

  const [errors, setErrors] = useState({});

  // Fetch vendor data
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await axios.get(`https://qr-code-i8zg.onrender.com/vendor/${target}`);
        setVendorName(response.data.vendor_name);
        setError(null); // Clear error if successful
      } catch (err) {
        setError('Error fetching vendor data');
        setVendorName('Unknown Vendor');
      } finally {
        setLoading(false);
      }
    };

    if (target !== 'General') fetchVendorData();
    else {
      setVendorName('General');
      setLoading(false);
    }
  }, [target]);

  const validateName = (name) => name.trim().length > 2; // Name must have at least 3 characters
  const validatePhone = (phone) => /^\d{10}$/.test(phone); // Exactly 10 digits
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Standard email format

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Real-time validation for specific fields
    if (name === 'name') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: validateName(value) ? '' : 'Name must be at least 3 characters long.',
      }));
    }

    if (name === 'phone') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: validatePhone(value) ? '' : 'Please enter a valid 10-digit phone number.',
      }));
    }

    if (name === 'email') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: value === '' || validateEmail(value) ? '' : 'Please enter a valid email address.',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, email } = formData;

    const newErrors = {};

    if (!validateName(name)) newErrors.name = 'Name must be at least 3 characters long.';
    if (!validatePhone(phone)) newErrors.phone = 'Please enter a valid 10-digit phone number.';
    if (email && !validateEmail(email)) newErrors.email = 'Please enter a valid email address.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(
          `https://qr-code-i8zg.onrender.com/vendor/${target}/customer`,
          {
            customer_name: name,
            phone,
            email,
          }
        );
        setSuccessMessage(`Customer added successfully: ${response.data.customer.customer_name}`);
        setFormSubmitted(true); // Set formSubmitted to true to hide the form

        // Set a timeout to hide the success message after 3 seconds and reset form
        // setTimeout(() => {
        //   setSuccessMessage('');
        //   setFormSubmitted(false); // Reset the form visibility after the message disappears
        //   setFormData({
        //     name: '',
        //     phone: '',
        //     email: '',
        //     target,
        //   }); // Optionally reset the form
        // }, 3000);
      } catch (err) {
        console.error('Error adding customer:', err);
        alert('Failed to add customer. Please try again.');
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className={`form2 ${formSubmitted ? 'form-hidden' : ''}`}>
        <h2>Contact Form</h2>

        {loading && <p>Loading vendor details...</p>}
        {error && <p className="error-message">{error}</p>}

        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-describedby="nameError"
            aria-invalid={!!errors.name}
          />
          {errors.name && <small id="nameError" className="error-message">{errors.name}</small>}
        </div>

        <div>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
            aria-describedby="phoneError"
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <small id="phoneError" className="error-message">{errors.phone}</small>}
        </div>

        <div>
          <label htmlFor="email">Email (optional):</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email (optional)"
            value={formData.email}
            onChange={handleChange}
            aria-describedby="emailError"
            aria-invalid={!!errors.email}
          />
          {errors.email && <small id="emailError" className="error-message">{errors.email}</small>}
        </div>

        <div>
          <label htmlFor="target">Vendor:</label>
          <input
            type="text"
            id="target"
            name="target"
            value={vendorName || ''}
            readOnly
            aria-readonly="true"
          />
        </div>

        <button type="submit" disabled={loading}>
          Submit
        </button>
      </form>

      {formSubmitted && (
        <div className="success-message">
          <div className="animated-vendor">{vendorName}</div>
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default FormPage;
