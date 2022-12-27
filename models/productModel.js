const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },  

    genre:{
        type:String,
        required:true
    },
    
    prize:{
        type:Number,
    },

    
   pcat:{
    type:String,
   },


    image:{
        type:String,
    },
   qty:{
    type:Number,
    default:0
   }
    
})

module.exports = mongoose.model('Product',productSchema)