const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  groups: {
    type: Array,
    required: false,
  },
  ngos: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model('User', userSchema);
