const UserAddress = require('../models/UserAddress');

// GET /api/users/addresses  –  List all saved addresses of current user
const getAddresses = async (req, res) => {
  try {
    const addresses = await UserAddress.find({ user: req.user._id }).sort('-isDefault -createdAt');
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users/addresses  –  Add a new address
const createAddress = async (req, res) => {
  try {
    const { fullName, phone, address, city, province, isDefault } = req.body;
    if (!fullName || !phone || !address || !city) {
      return res.status(400).json({ message: 'fullName, phone, address and city are required.' });
    }

    // If setting as default, unset previous default
    if (isDefault) {
      await UserAddress.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const addr = await UserAddress.create({ user: req.user._id, fullName, phone, address, city, province, isDefault: !!isDefault });
    res.status(201).json({ message: 'Address added.', address: addr });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/addresses/:id  –  Update an address
const updateAddress = async (req, res) => {
  try {
    const { fullName, phone, address, city, province, isDefault } = req.body;

    if (isDefault) {
      await UserAddress.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const addr = await UserAddress.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { fullName, phone, address, city, province, isDefault: !!isDefault },
      { new: true, runValidators: true }
    );
    if (!addr) return res.status(404).json({ message: 'Address not found.' });
    res.json({ message: 'Address updated.', address: addr });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/users/addresses/:id  –  Delete an address
const deleteAddress = async (req, res) => {
  try {
    const addr = await UserAddress.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!addr) return res.status(404).json({ message: 'Address not found.' });
    res.json({ message: 'Address deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAddresses, createAddress, updateAddress, deleteAddress };
