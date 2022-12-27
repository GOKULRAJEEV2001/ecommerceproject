
const mongoose = require('mongoose');

const addressSchema=mongoose.Schema({ 


    
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User'

  },


  name: {
    type: String,
  },
  
  cname: {
    type: String,

  },

  country: {
    type: String,

  },

  address: {
    type: String,

  },

  town: {
    type: String,

  },

  state: {
    type: String,

  },

  postcode: {
    type: Number,

  },

  phone: {
    type: Number,

  },

  email: {
    type: String,

  },



})

module.exports = mongoose.model('Address',addressSchema)
