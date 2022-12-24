

const mongoose = require('mongoose');

const cartSchema=mongoose.Schema({

userId:{
  
  type :mongoose.Types.ObjectId,
  ref:'User',

},

 
    items: [
      {
        pid: {
          type: mongoose.Types.ObjectId,
          ref:"Product", 
          required:true
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

    totalPrice:{
      type: Number,
      default: 0
    }
  

})

  module.exports = mongoose.model('Cart',cartSchema)