let mongoose = require('mongoose');

// Property Schema
let propertySchema = mongoose.Schema({
  landid:{
    type: Number,
    required: true
  },
  aadhar:{
    type: Number,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  previous_owner:{
    type: String,
    required: true
  },
  cordinate_1:{
    type: Number,
    required: true
  },
  cordinate_2:{
    type: Number,
    required: true
  },
  area:{
    type: Number,
    required: true
  },
  tax_paid:{
    type: String,
    required: true
  },
  liability:{
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true
  }
});

let Property = module.exports = mongoose.model('Property', propertySchema);
