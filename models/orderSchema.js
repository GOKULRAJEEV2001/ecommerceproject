const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({


  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User'

  },


  name: {
    type: String,

  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
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

  payment: {
    type: String,
  },


  is_varified: {
    type: Number,
    default: 1
  },

  status: {
    type: String,
    default: 'pending'
  },


  items: [
    {
      pid: {
        type: mongoose.Types.ObjectId,
        ref: "Product",

      },
      price: {
        type: Number,
      },
      qty: {
        type: Number,
        required: true,
      },
    }
  ],
  totalPrice: {
    type: Number,
    default: 0
  }



})


module.exports = mongoose.model('Order', orderSchema)