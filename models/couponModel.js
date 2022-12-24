
const mongoose = require('mongoose');

const couponSchema=mongoose.Schema({


    couponCode: {
        type: String,
    },

    createdAt:{
        type:Date,
        immutable:true,
        default:()=>Date.now()
    },

    couponDiscount: {
        type:Number
    },





})

module.exports = mongoose.model('Coupon', couponSchema) 
