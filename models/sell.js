let mongoose = require('mongoose');

// Article Schema
let sellSchema = mongoose.Schema({
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
  mob:{
    type: Number,
    required: true
  },
  previous_owner:{
    type: String,
    required: true
  },
  current_owner:{
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
  },
  buyer_name:{
    type: String,
    required: true
  },
  approved:{
    type: String,
    required: true
  }
});

let Sell = module.exports = mongoose.model('Sell', sellSchema);
