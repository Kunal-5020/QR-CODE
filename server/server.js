const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Vendor = require('./models/vendor'); // Import the Vendor model

const app = express();

// Use CORS middleware
app.use(cors());  // This will allow all domains by default, you can restrict to specific domains if needed

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://solution:qrcode@cluster0.0dypo.mongodb.net/VendorDB?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB: ', err));

// 1. Create a Data Field (Vendor)
app.post('/vendor', async (req, res) => {
  try {
    const { vendor_name, vendor_phone, vendor_shoplocation } = req.body;

    const vendor = new Vendor({ vendor_name, vendor_phone, vendor_shoplocation });
    await vendor.save();

    res.status(201).json({ message: 'Vendor created successfully', vendor });
  } catch (error) {
    res.status(400).json({ message: 'Error creating vendor', error });
  }
});

// 2. Delete a Data Field (Vendor)
app.delete('/vendor/:id', async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findByIdAndDelete(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor deleted successfully', vendor });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting vendor', error });
  }
});

// 3. Update a Data Field (Vendor)
app.put('/vendor/:id', async (req, res) => {
  try {
    const vendorId = req.params.id;
    const { vendor_name, vendor_phone, vendor_shoplocation } = req.body;

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { vendor_name, vendor_phone, vendor_shoplocation },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor updated successfully', vendor: updatedVendor });
  } catch (error) {
    res.status(400).json({ message: 'Error updating vendor', error });
  }
});

// 4. Get All Data (Vendors)
app.get('/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching vendors', error });
  }
});

// 5. Add Customer Data to a Vendor
app.post('/vendor/:id/customer', async (req, res) => {
  try {
    const vendorId = req.params.id;
    const { customer_name, phone, email } = req.body;

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const newCustomer = { customer_name, phone, email };
    vendor.customer_data.push(newCustomer);

    await vendor.save();
    res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });
  } catch (error) {
    res.status(400).json({ message: 'Error adding customer', error });
  }
});

// 6. Get Specific Vendor by ID
app.get('/vendor/:id', async (req, res) => {
  try {
    const vendorId = req.params.id;
    console.log(vendorId);

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching vendor', error });
  }
});





// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
