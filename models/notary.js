let mongoose = require('mongoose');

// Notary Schema
let notarySchema = mongoose.Schema({
  notuser:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
});

let Notary = module.exports = mongoose.model('Notary', notarySchema);
