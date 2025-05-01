const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Address Sub-Schema
const addressSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Home, Work
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  isPrimary: { type: Boolean, default: false }
}, { _id: true });

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  addresses: { type: [addressSchema], default: [] },
  cart: {
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        subtitle: String,
        image: String,
        price: Number,
        quantity: { type: Number, default: 1 }
      }
    ],
    subtotal: { type: Number, default: 0 },
    itemCount: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password verification
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);