const express=require("express");
const userRoute=express();
const session = require("express-session");

const config= require("../config/config");
userRoute.use(session({secret:config.sessionSecret}));

const auth = require("../middleware/auth");


userRoute.set('view engine','ejs');
userRoute.set('views','./views/users');

const bodyParser=require('body-parser'); 
userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({extended:true}))


const userController = require("../controllers/userController");

const { application } = require("express");

//userRoute.use(express.static("public"));

userRoute.get('/register', (req,res)=>{
    res.render('register')
});  

userRoute.post('/register',userController.insertUser);

module.exports=userRoute;

userRoute.get('/',userController.indexLoad);
userRoute.get('/login',userController.loginLoad);
userRoute.get('/logout',userController.logout);
userRoute.post('/login',userController.verifylogin);


userRoute.get('/',userController.loadHome);

userRoute.get('/view-cart',userController.viewCart);

userRoute.get('/add-cart',userController.addtoCart);

userRoute.post('/del-cart',userController.deleteCart);

userRoute.get('/add-wish',userController.addtoWish);


userRoute.post('/add-check',userController.checkoutFinal);

userRoute.get('/view-checkout',userController.viewCheckout);

userRoute.get('/wish-view',userController.viewWishlist);

userRoute.post('/updateQuantity',userController.updateQuantity);

userRoute.get('/order-placed',userController.orderPlaced);

userRoute.get('/back-home',userController.backHome);

userRoute.get('/user-dash',userController.userDash);

userRoute.post('/otp-valid',userController.otpValidation);

userRoute.get('/sign-out',userController.signOut);

userRoute.post('/orderdetails',userController.orderDetails);

userRoute.get('/sel-categories', userController.selCategories);

userRoute.get('/go-back',userController.backCheckout);

userRoute.post('/apply-coupon',userController.applyCoupon);

userRoute.post('/save-add',userController.saveAdd);


//userRoute.get('/order-placed',userController)

module.exports = userRoute;  