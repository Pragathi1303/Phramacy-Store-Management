const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Tablets', 'Syrups', 'Injections', 'Vitamins', 'Skincare', 'Equipment', 'Other'],
    },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, default: '' },
    requiresPrescription: { type: Boolean, default: false },
    manufacturer: { type: String, default: '' },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
