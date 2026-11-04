const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },

  nameAr: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    maxlength: 1000
  },

  category: {
    type: String,
    enum: ['wound_care', 'injection', 'iv_therapy', 'vital_signs', 'physiotherapy', 'elderly_care', 'other'],
    required: true
  },

  basePrice: {
    type: Number,
    required: true,
    min: 0
  },

  minPrice: {
    type: Number,
    default: 0
  },

  maxPrice: {
    type: Number,
    default: null
  },

  icon: {
    type: String,
    default: null
  },

  isActive: {
    type: Boolean,
    default: true
  },

  // When true (default), patient requests for this service wait in
  // under_review until an admin approves (or sets) the price — nurses
  // can only see/accept admin-approved requests.
  requireApproval: {
    type: Boolean,
    default: true
  },

  estimatedDuration: {
    type: Number,
    default: 30
  },

  // Itemized sub-procedures the patient may pick at booking time. The order
  // total equals the sum of the selected components; when the patient picks
  // none (or the service has no components) the flat basePrice applies.
  // Prices here are set by the admin alongside basePrice.
  components: [{
    _id: false,
    key: { type: String, required: true, trim: true },
    name: { type: String, default: null, trim: true },
    nameAr: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }
  }]

}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
