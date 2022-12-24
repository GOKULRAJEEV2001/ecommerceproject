const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    

name:{
    type:String,
    required:true

},

email:{
    type:String,
  required:true
},

password:{
    type:String,
   required:true
},

cpassword:{
  type:String,
 required:true
},




mno:{
  type:Number,
  required:true
},


otp:{
  type:Number,
  
},

is_admin:{
    type:Number,
    default:0
},
 
is_varified:{
    type:Number,
    default:1

}

});

module.exports = mongoose.model('User',userSchema);