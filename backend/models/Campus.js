const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      radius: { type: Number, default: 300 } // default 300 meters
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campus', campusSchema);
