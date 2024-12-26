import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react"; // Correct import
import "../css/VendorProfile.css";

const VendorProfile = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updatedVendor, setUpdatedVendor] = useState({
    vendor_name: "",
    vendor_phone: "",
    vendor_shoplocation: "",
  });

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const vendorResponse = await axios.get(
          `https://qr-code-i8zg.onrender.com/vendor/${vendorId}`
        );
        setVendor(vendorResponse.data);
        setUpdatedVendor({
          vendor_name: vendorResponse.data.vendor_name,
          vendor_phone: vendorResponse.data.vendor_phone,
          vendor_shoplocation: vendorResponse.data.vendor_shoplocation,
        });
      } catch (err) {
        setError("Error fetching vendor data");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [vendorId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setUpdatedVendor({
      ...updatedVendor,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://qr-code-i8zg.onrender.com/vendor/${vendorId}`,
        updatedVendor
      );
      setVendor(response.data);
      setIsEditing(false);
    } catch (err) {
      setError("Error updating vendor data");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://qr-code-i8zg.onrender.com/vendor/${vendorId}`);
      navigate("/admin/vendor-list");
    } catch (err) {
      setError("Error deleting vendor");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="vendor-container">
      <h2 className="vendor-header">Vendor Profile</h2>

      {vendor && (
        <div className="vendor-details">
          <div className="details-section">
            <div>
              <h3>{vendor.vendor_name}</h3>
              <p>
                <strong>Phone:</strong> {vendor.vendor_phone}
              </p>
              <p>
                <strong>Location:</strong> {vendor.vendor_shoplocation}
              </p>
            </div>
            <div className="qr-code-section">
              <h4>QR Code</h4>
              <QRCodeCanvas
                value={`http://192.168.1.2:3000/?target=${vendorId}`}
                size={100}
              />
              <p>
                <a
                  href={`http://192.168.1.2:3000/?target=${vendorId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Link
                </a>
              </p>
            </div>
          </div>


          {isEditing && (
            <form onSubmit={handleUpdate} className="edit-form">
              <div className="form-group">
                <label>Vendor Name</label>
                <input
                  type="text"
                  name="vendor_name"
                  value={updatedVendor.vendor_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="vendor_phone"
                  value={updatedVendor.vendor_phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="vendor_shoplocation"
                  value={updatedVendor.vendor_shoplocation}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="update-btn">
                Update
              </button>
            </form>
          )}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <p>
              Are you sure you want to delete <strong>{vendor.vendor_name}</strong>?
            </p>
            <button onClick={handleDelete} className="confirm-btn">
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h3 className="customer-header">Customer List</h3>
      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {vendor.customer_data.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.customer_name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="footer-header">Vendor Name: {vendor.vendor_name}</h3>
      <p className="footer-info">Vendor actions and details at the bottom.</p>


      <div className="actions">
            <button onClick={handleEditToggle} className="edit-btn">
              {isEditing ? "Cancel Edit" : "Edit"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
    </div>
  );
};

export default VendorProfile;
