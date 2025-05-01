const User = require('../models/User');

// Get all addresses
exports.getAddresses = async (req, res) => {
  res.json({ success: true, data: req.user.addresses });
};

// Add new address
exports.addAddress = async (req, res) => {
  try {
    const user = req.user;
    const newAddress = req.body;

    if (newAddress.isPrimary) {
      // Unset previous primary
      user.addresses.forEach(addr => addr.isPrimary = false);
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: user.addresses[user.addresses.length - 1]
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const user = req.user;
    const addressId = req.params.id;

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ success: false, message: 'Address not found' });

    Object.assign(address, req.body);

    if (req.body.isPrimary) {
      user.addresses.forEach(addr => addr.isPrimary = false);
      address.isPrimary = true;
    }

    await user.save();
    res.json({ success: true, message: 'Address updated successfully', data: address });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const user = req.user;
    const address = user.addresses.id(req.params.id);
    if (!address) return res.status(404).json({ success: false, message: 'Address not found' });

    address.remove();
    await user.save();

    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Set primary address
exports.setPrimaryAddress = async (req, res) => {
  try {
    const user = req.user;
    const addressId = req.params.id;

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ success: false, message: 'Address not found' });

    user.addresses.forEach(addr => (addr.isPrimary = false));
    address.isPrimary = true;

    await user.save();
    res.json({ success: true, message: 'Address set as primary successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};