const express=require("express");
const adminRoute=express();
const session = require("express-session");

const config= require("../config/config");
adminRoute.use(session({secret:config.sessionSecret}));

const auth = require("../middleware/auth");


adminRoute.set('view engine','ejs');
adminRoute.set('views','./views/admin');

const bodyParser=require('body-parser');
adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({extended:true}))


const adminController = require("../controllers/adminController");
//const userController = require("../controllers/userController");
const { application } = require("express");




adminRoute.get('/',adminController.loadLogin);
//adminRoute.get('/adlogin',adminController.loadLogin);

adminRoute.post('/adlogin',adminController.verifyadLogin);


adminRoute.get('/viewProducts',adminController.viewPro);

adminRoute.get('/admin',adminController.adlogout);

//adminRoute.get('/userEdit',auth.isadLogin,adminController.userEditload);

//adminRoute.get('/userEdit',adminController.updateUserLoad);

//adminRoute.post('/userEdit',adminController.updateUserLoad);



adminRoute.get('/block-user',adminController.blockUser);

adminRoute.get('/add-pro',adminController.addPro);

adminRoute.post('/product-add',adminController.upload,adminController.updateAddProduct);

adminRoute.get('/view-products',adminController.viewProduct);

adminRoute.get('/edit-product',adminController.productEdit);

adminRoute.post('/update-products',adminController.upload,adminController.updateProduct);

adminRoute.get('/delete-pro',adminController.deleteproduct);

adminRoute.get('/order-list',adminController.orderList);

adminRoute.post('/order-status',adminController.orderStatus);

adminRoute.post('/cancel-order',adminController.cancelOrder);

adminRoute.get('/goback',adminController.goBack);

adminRoute.get('/add-cat',adminController.addCat);

adminRoute.post('/update-cat',adminController.addCategory);

adminRoute.post('/delete-cat',adminController.delCat);

adminRoute.get('/ad-stat',adminController.adminHome);

adminRoute.get('/dash-Board',adminController.dashBoard);

adminRoute.get('/add-cop',adminController.addCop);

adminRoute.post('/add-coupon',adminController.addcoupon);

adminRoute.post('/delete-coupon',adminController.delCoupon);

adminRoute.get('/view-bann',adminController.banner);

adminRoute.post('/add-banner',adminController.upload,adminController.addbanner);

adminRoute.post('/delete-banner',adminController.deleteBanner);

adminRoute.get('/sales-report',adminController.salesReport)





adminRoute.get('*',function(req,res){ 

    res.redirect('/admin');


});

//userRoute.get('/home',auth.isLogin,userController.loadHome); 

module.exports = adminRoute;  