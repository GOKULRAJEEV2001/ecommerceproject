const User = require('../models/userModel');
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order= require("../models/orderSchema");
const Category=require('../models/categoryModel');
const Coupon = require("../models/couponModel");
const Banner = require('../models/bannerModel');
const Address=require('../models/addressModel');

const bcrypt=require('bcrypt');
const fast2sms=require('fast-two-sms');

let isloggedIn = false;

let usersession = {
    userId : ''
}
let USERID;

 //registration

// const loadRegister=(req,res)=>{

//     try{

//         res.render('register');
//     }
//     catch(error){
//         console.log(error);
//     }

// }

const insertUser = async(req,res)=>{

        try {
            const password = req.body.password;
            const cpassword=req.body.cpassword;
            const passwordHash = await bcrypt.hash(password, 10); 
            const cpasswordHash = await bcrypt.hash(cpassword, 10); 
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                mno: req.body.mno,
                password: passwordHash,
                cpassword:cpasswordHash

            
                
            });
            const userData = await user.save();
            USERID=userData._id;

            
            


            if(password==cpassword){
            



            if (userData) {
                
                const otp = sendMessage(req.body.mno)
                res.render('otp');
            }
            else {
                res.render('register', { message: "Your registration has been failed" })
            }
        }

        else{
        res.render('register', { message: " passwords are incorect" });
          }

        } catch (error) {
            console.log(error.message);
        }
    }

    const sendMessage = function (mobile, res) {
        randomOTP = Math.floor(Math.random() * 10000)
        var options = {
            authorization: 'MSOj0bTnaP8phCARmWqtzkgEV4ZN2Ff9eUxXI7iJQ5HcDBKsL1vYiamnRcMxrsjDJboyFEXl0Sk37pZq',
            message: `Your OTP verification code is ${randomOTP}`,
            numbers: [mobile]
        }
    
        fast2sms.sendMessage(options)
            .then((response) => {
                console.log("OTP sent succcessfully")
            }).catch((error) => {
                console.log(error)
            })
        return randomOTP;
    }
     

    //otp verification


    const otpValidation = async (req, res) => {
        try {
            usersession = req.session;
            const otp = req.body.otp;
            if (otp == randomOTP) {
                const validatedUser = await User.findById({_id: USERID })
                validatedUser.is_varified = 1
                const test = await validatedUser.save();
                if (test) {
                    isLogin = true
                    res.redirect('/login')
                } else {
                    res.render('otp', { message: "Incorrect OTP" })
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    
    }


//index 

const indexLoad = async(req,res)=>{

    
  var search = '';
  if (req.query.search) {

    search = req.query.search;

  }


  const productData = await Product.find({
    is_admin: 0,
    $or: [
      { name: { $regex: '.*' + search + '.*' } },
      { genre: { $regex: '.*' + search + '.*' } }
    ]

  });

    
    const banner = await Banner.find();


    const categories = await Category.find()
    res.render('home',{ isloggedIn,
        products:productData,category:categories,banner:banner})

    

}


//loginuser methodes

const loginLoad = async(req,res)=>{

    try{
        res.render('login');

    } catch(error){
        console.log(error.message);
    }
}

//verify user

const logout= (req,res)=>{
    isloggedIn=false
    res.redirect('/')
}


const verifylogin = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        console.log(password, "req");
        const userData = await User.findOne({ email: email });
        console.log(userData.password);
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            console.log(passwordMatch);
            if (passwordMatch) {
                console.log(passwordMatch);
                if (userData.is_varified === 0) {
                    
                    res.render('login', { message: "enter correct  name and password" });
                }
                else {
                    req.session.email = req.body.email;
                    req.session.userId = userData._id;
                
                    usersession.userId = req.session.userId
                    
                    
                    isloggedIn=true;
                    res.redirect('/');
                }

            }
            else {
              
                res.render('login', { message: "email and password are incorect" });
            }

        }
        else {
             
            res.render('login', { message: "email and password are incorrect" });


        }

    } catch (error) {
        
        console.log(error.message);
    }

}

const loadHome = async(req,res)=>{
    

    const productData=await Product.find();
    const categories = await Category.find()
    res.render('home',{ isloggedIn,
        products:productData,category:categories})

    


}

const viewCart=async(req,res)=>{

    usersession=req.session
    const productData = await Cart.findOne({userId: req.session.userId}).populate('items.pid');
     const fortotal = await Cart.findOne({userId:req.session.userId});
    
    productData.totalPrice = 0

    const totalPrice = productData.items.reduce((acc, curr) => {
        return acc + (curr.pid.prize * curr.qty)
    }, 0)
    productData.totalPrice = totalPrice

    const  saved= await productData.save()


    if(saved){ 
        res.render('cart',{cartViews:productData.items,fortotal:fortotal});
    
    

    }else{
        res.render('cart',{cartViews:''});
    }

}

const addtoCart = async (req, res) => {
    usersession = req.session;
    const pId = req.query.id;
    const productData = await Product.findOne({_id:req.query.id});
    console.log(productData);
   
    const isExisting = await Cart.findOne({ userId:  usersession.userId })
    // const productData = await Product.findById({_id: req.query.id})
    if (isExisting!=null) {
        
        const smProduct = await Cart.findOne({ userId: usersession.userId, 'items.pid': pId})
        
        if (smProduct!=null) {
            
            const incCart = await Cart.updateOne({ userId: usersession.userId,'items.pid': pId },
                { $inc: { 'items.$.qty': 1 } })   
                  res.redirect('/')
        } else{
            console.log("else");
            const updateCart = await Cart.updateMany({ userId: usersession.userId },
                { $push: { items: { "pid": pId, "qty": 1, "price":productData.prize} } }) 
            res.redirect('/')
        }

    } else {
        
        const cart = new Cart({
            userId: usersession.userId,
            items: [
                {
                    pid:pId,
                    price: productData.prize,
                    qty: 1
                }
            ],
            totalprice: 0

        })
        const cartData = await cart.save();
        res.redirect('home')

    }
}

const addtoWish = async (req, res) => {
    usersession = req.session;
    const pId = req.query.id;
    const productData = await Product.findOne({_id:req.query.id});
    
   
    const isExisting = await Cart.findOne({ userId:  usersession.userId })
    // const productData = await Product.findById({_id: req.query.id})
    if (isExisting!=null) {
        
        const smProduct = await Cart.findOne({ userId: usersession.userId, 'items.pid': pId})
        
        
        } 

     else {
        
        const cart = new Cart({
            userId: usersession.userId,
            items: [
                {
                    pid:pId,
                    price: productData.prize,
                    qty: 1
                }
            ],
            totalprice: 0

        })
        const cartData = await cart.save();
        res.redirect('home')

    }
}

const viewCheckout= async(req,res)=>{
    
    const orderData= await Order.find();
    const productData = await Cart.findOne({userId: req.session.userId}).populate('items.pid');
    const fortotal = await Cart.findOne({userId:req.session.userId});
    const addnewadd= await Address.find({userId:req.session.userId});
    console.log(addnewadd);
    console.log(req.query.id);
    const queryadd = await Address.findOne({_id:req.query.id})
    console.log(queryadd);
    res.render('checkout',{orders:orderData,totalprice: fortotal.totalPrice,newadd:addnewadd,saddress:queryadd});

}

const backCheckout= async(req,res)=>{
    
    const orderData= await Order.find();
    const productData = await Cart.findOne({userId: req.session.userId}).populate('items.pid');
    const fortotal = await Cart.findOne({userId:req.session.userId});
    
    res.redirect('/view-checkout');

}


const checkoutFinal = async (req, res) => {
    usersession:req.session
    
    const cartData = await Cart.findOne({ userId:usersession.userId });
    
    const orders = new Order({
        userId: usersession.userId,
        name: req.body.name,
        cname:req.body.cname,
        email: req.body.email,
      
        phone: req.body.phone,
        address: req.body.address,
        
        country: req.body.country,
        town: req.body.town,
        state: req.body.state,
        
        payment: req.body.payment,
        items: cartData.items,
        totalPrice: cartData.totalPrice,
        
    })
    await orders.save()
    req.session.currentOrder = orders._id;
    const order = await Order.findById({_id:req.session.currentOrder})
    const productDetails = await Product.find()
        for(let i=0;i<productDetails.length;i++){
            for(let j=0;j<order.items.length;j++){
               
             if(productDetails[i]._id.equals(order.items[j].pid)){
                 productDetails[i].qty+=order.items[j].qty;
             }    
            }productDetails[i].save()
         }

    if (req.body.payment == 'cod') {
        await Order.findOneAndUpdate({ userId: req.session.userId }, { status: 'build' })
        const orderData = await Order.findOne({userId:req.session.userId}).populate('items.pid')
        const fortotal= await Order.findOne({userId: req.session.userId})
        res.render('cod', {cart:orderData.product, totalPrice:fortotal})
        const ordersData = await Order.findOne({userId:req.session.userId})
    } else if (req.body.payment == 'paypal') {
        
        const fortotal = await Cart.findOne({userId:req.session.userId});

        res.render('paypal',{fortotal:fortotal})
  
    }
  } 

  
const viewWishlist=async(req,res)=>{

    const productData = await Cart.findOne({userId: req.session.userId}).populate('items.pid');
    const fortotal = await Cart.findOne({userId:req.session.userId});
    
    res.render('wishlist',{cartViews:productData.items,fortotal:fortotal});
}


const deleteCart = async (req, res) => {
    try {
        usersession=req.session
        
        // const cartItem = await Cart.cartProduct.splice(_id:cartItemId)
        await Cart.findOneAndUpdate({ userId: req.session.userId }, {
            $pull: {
                items:
                    { _id: req.query.id }
            }
        })
        res.redirect('/view-cart')
    } catch (error) {
        console.log(error.message);
    }
}
  
const updateQuantity = async (req, res) => {
    usersession = req.session
    const p_id = req.query.id;
    const productData = await Cart.findOne({ userId: usersession.userId }).populate('items.pid')
    const index = await productData.items.findIndex(cartItems => cartItems._id == p_id)
    productData.items[index].qty = req.body.qty
    

    productData.totalprice = 0

    const totalPrice = productData.items.reduce((acc, curr) => {
        return acc + (curr.pid.prize * curr.qty)
    }, 0)


    productData.totalPrice = totalPrice

    await productData.save()

    res.redirect('/view-cart')

}
  
const orderPlaced=(req,res)=>{
  

    res.render('orderPlaced')
}

 
const backHome=async(req,res)=>{

    const productData=await Product.find();
  

    res.render('home',{ isloggedIn,products:productData})
}




const signOut=async(req,res)=>{
  

    res.render('login')
}

 
const  userDash=async(req,res)=>{
  
      usersession=req.session
const orderData = await Order.find({userId:usersession.userId})


const fortotal = await Cart.find({userId:usersession.userId});


    res.render('userDashboard',{orders:orderData,fortotal:fortotal})
}

const  postOtp=(req,res)=>{

    res.render('login')
}

const orderDetails=async(req,res)=>{
    usersession=req.session
    const oid=req.query.id;

    const orderData = await Order.findOne({_id:oid}).populate('items.pid')
    
    const fortotal = await Order.findOne({_id:oid});
    


    res.render('orderDetails',{cart:orderData.items,totalPrice:fortotal}); 


}

const selCategories = async (req, res) => {
    const productData = await Product.find({ genre: req.query.id })
    const categories = await Category.find()
    res.render('home', { products: productData, isloggedIn, category: categories })
}

const  applyCoupon = async (req, res) => {
    try {
        console.log('1');
        const userCart = await Cart.findOne({ userId: req.session.userId })
         
    


        const couponCode = req.body.couponcode
        console.log(couponCode,'coupon');
        
        req.session.couponcode = couponCode

        const totalcart = await Cart.findOne({ userId: req.session.userId })
        const coupon = await Coupon.findOne({ couponCode: couponCode })
       const couponDiscount = coupon.couponDiscount
        if (coupon) {
            if (totalcart) {
                
                const totalprice = totalcart.totalPrice
                console.log('Total price is here :', totalprice);
                const newtotalprice = (totalprice-((totalprice * couponDiscount) / 100))
                
                req.session.totalPrice = newtotalprice
                
                const addnewadd= await Address.find({userId:req.session.userId});
                const queryadd = await Address.findOne({_id:req.query.id})
                
                res.render('checkout', { message: '', totalprice: req.session.totalPrice, coupon: req.session.couponcode,newadd:addnewadd,saddress:queryadd })
            } else {
                res.redirect('/view-checkout')
            }
        } else {   
            res.redirect('/view-checkout')
            console.log('There no coupon like that');
        }
    } catch (error) {
        if (error) {
            res.redirect('/')
        }
        console.log(error.message);
    }
}

const saveAdd = async(req,res)=>{
    try {
        const address = new Address({
        userId: req.session.userId,
        name: req.body.name,
        cname:req.body.cname,
        email: req.body.email,
      
        phone: req.body.phone,
        address: req.body.address,
        
        country: req.body.country,
        town: req.body.town,
        state: req.body.state,
        })
        await address.save();
        
        res.redirect('/user-dash')
    } catch (error) {
        console.log(error.message);
    }
}
  

  
  
  
  


// const orderPlaced=async(req,res)=>{

//     res.render
// }



//isloggedin

// const isLogin= (req,res,next)=> {
//     if(req.session.email){
//         next()
//     }else{
//         res.redirect('/login')
//     }
// }

// //isloggedout
// const isLogout= (req,res,next)=> {
//     if(req.session.email){
//         res.redirect('/')
//     }else{

//         next()
        
//     }
// }


module.exports={
    // loadRegister,
    insertUser, 
    loginLoad,
    verifylogin,
    loadHome,
    indexLoad,
    logout,
    viewCart,
    addtoCart,
    viewCheckout,
    checkoutFinal,
    viewWishlist,
    updateQuantity,
    orderPlaced,
    backHome,
    userDash,
    sendMessage,
    otpValidation,
    postOtp,
    signOut,
    orderDetails,
    selCategories,
    backCheckout,
    addtoWish,
    deleteCart,
    applyCoupon,
    saveAdd
}
