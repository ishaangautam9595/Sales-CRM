const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  schoolName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  progressStatus: { type: String },
  statusHistory: [
    {
      status: { type: String },
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      description: { type: String },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
  emailCampaigns: [{
    category: { 
      type: String, 
      enum: ['Promotional', 'Follow-up', 'Newsletter'], 
      required: true 
    },
    content: { type: String, required: true },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sentAt: { type: Date, default: Date.now },
  }],
});

module.exports = mongoose.model('Lead', leadSchema);