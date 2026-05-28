const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['reminder', 'alert', 'report'], default: 'reminder' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    sent: { type: Boolean, default: false },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
