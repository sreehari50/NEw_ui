let mongoose = require('mongoose');

// Article Schema
let bankSchema = mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  balance:{
    type: Number,
    required: true
  }
});

let Bank = module.exports = mongoose.model('Bank', bankSchema);
