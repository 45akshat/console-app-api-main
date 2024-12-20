const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true
  },
  Code: {
    type: String,
    required: true
  },
  Reward: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    default: Date.now
  },
  Validity: {
    type: String,
    default: '30 days'
  }
});

const Code = mongoose.model('Code', codeSchema, 'codes');

module.exports = Code;
