const mongoose = require('mongoose');

// Define the schema for customer data
const customerSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true }
});

// Define the schema for vendor data
const vendorSchema = new mongoose.Schema({
  vendor_name: { type: String, required: true },
  vendor_phone: { type: String, required: true },
  vendor_shoplocation: { type: String, required: true },
  customer_data: {
    type: [customerSchema],
    default: [] // Set default to an empty array
  }
});

// Create the Vendor model
const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
