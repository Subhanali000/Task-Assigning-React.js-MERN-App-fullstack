const mongoose = require('mongoose');

const listSchema = new mongoose.Schema(
  {
    name: { type: String },
    mobile: { type: String },
    notes: { type: String },
    fileName: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('List', listSchema);
