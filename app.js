const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");

const userRoute=require('./routes/userRoute');

const adminRoute = require('./routes/adminRoute');





const bcrypt = require('bcrypt');


const path = require('path')
const express=require("express");
const app=express(); 
const session= require("express-session");
const config=require("./config/config");
app.use(session({secret:config.sessionSecret}));

const User = require('./models/userModel');
const Product = require('./models/productModel');
const Cart = require('./models/cartModel');
const Order= require('./models/orderSchema');




adminRoute.use('/',express.static('public'));
adminRoute.use('/',express.static('public/admin'));

userRoute.use('/',express.static('public'));
userRoute.use('/',express.static('public/users'));





//for user rounte

app.use('/',userRoute);



    
app.set('view engine','ejs');
app.set('views','./views/users');

//for admin side


app.use('/admin',adminRoute);



app.listen(3000,function(){
    console.log("server is running");
});
 