const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/orderSchema");
const Cart = require("../models/orderSchema");
const Category = require("../models/categoryModel");
const Coupon = require("../models/couponModel");
const bcrypt = require('bcrypt');
const Banner = require('../models/bannerModel');


const path = require("path");
const multer = require("multer");
const { log } = require("console");
const { render } = require("../routes/userRoute");
let storage = multer.diskStorage({
  destination: "./public/assets/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({
  storage: storage,
}).single("image");



let isadLogin
isadLogin = false


let usersession = {
  userId: ''
}


let adminSession
const loadLogin = (req, res) => {

  try {

    res.render('adlogin');

  } catch (error) {

    console.log(error.message);
  }
}


//const uploads= multer({ storage:storage }).single("productImage");


const dashBoard = async (req, res) => {




  var search = '';
  if (req.query.search) {

    search = req.query.search;

  }


  const userData = await User.find({
    is_admin: 0,
    $or: [
      { name: { $regex: '.*' + search + '.*' } },
      { email: { $regex: '.*' + search + '.*' } }
    ]

  });


  //res.redirect('/admin/dash-Board');


    res.render('dashboard', { users: userData });
  
  }




const verifyadLogin = async (req, res) => {

  try {


    const email = req.body.email;
    const password = req.body.password;



    console.log(email);
    const userData = await User.findOne({ email: email });
    
    if (userData) {

      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (passwordMatch) {
        
        if (userData.is_admin === 0) {




          res.render('adlogin', { message: "email and password  are incorrect" });

        }

        else {


          const userData = await User.find({ is_admin: 0 });
          req.session.email = req.body.email;
          req.session.id = req.body.id;

          const productData = await Product.find();
          const orderData = await Order.find();
          isadLogin = true
          //console.log(userData);
          res.redirect('/admin/dash-Board'); 
        }

      }

    }
    else {

      res.render('adlogin', { message: "emai and password  are incorrect" });
    }

  } catch (error) {

    console.log(error.message);
  }
}





const viewPro = async (req, res) => {
  const productData = await Product.find({ is_admin: 0 });

  res.render('viewProducts', { products: productData });

}

const addPro = async (req, res) => {

  res.render('addProducts');
}

const updateAddProduct = async (req, res) => {
  try {

    const product = new Product({


      name: req.body.name,
      genre: req.body.genre,
      prize: req.body.prize,
      description:req.body.description,

      image: req.file.filename



    });
    
    const productData = await product.save();
    if (productData) {
      res.render("addProducts", {
        message: "Your registration was successfull.",
      });
    } else {
      res.render("addProducts", { message: "Your registration failed" });
    }
  } catch (error) {
    console.log(error.message);
  }
};













//admin logout


const adlogout = (req, res) => {
  isloggedIn = false
  res.redirect('/admin')
}

const productEdit = async (req, res) => {
  try {
    const id = req.query.id;
    const productData = await Product.findById({ _id: id });
    if (productData) {
      res.render('editProduct', { products: productData })
    } else {
      console.log('Product not found')
    }
  } catch (error) {
    console.log(error.message);
  }
}

const updateProduct = async (req, res) => {
  try {
    console.log(req.body);
    await Product.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, prize: req.body.prize,description:req.body.description, genre: req.body.genre, image: req.file.filename } })
    res.redirect('/admin/viewProducts')
  } catch (error) {
    console.log(error.message);
  }
}



  //const userData = await User.find({ is_admin: 0 });


const blockUser = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id });
    if (userData.is_varified) {
      await User.findByIdAndUpdate({ _id: id }, { $set: { is_varified: 0 } });
    } else {
      await User.findByIdAndUpdate({ _id: id }, { $set: { is_varified: 1 } });
    }
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

const viewProduct = async (req, res) => {
  try {
    const productData = await Product.find();
    res.redirect("/admin/viewProducts");
  } catch (error) {
    console.log(error.message);
  }
};

const editProduct = async (req, res) => {
  try {
    const id = req.query.id
    const productData = await Product.findById({ _id: id })
    if (productData) {
      res.render('editProduct', { product: productData })
    }
    else {
      res.redirect('/admin/viewProduct')
    }

  } catch (error) {
    console.log(error.message);
  }
}

const deleteproduct = async (req, res) => {

  try {
    const id = req.query.id;
    await Product.deleteOne({ _id: id });
    res.redirect('/admin/viewProducts');
  }

  catch (error) {
    console.log(error.message);
  }
}

const orderList = async (req, res) => {

  const orderData = await Order.find();
  const fortotal = await Cart.findOne({ userId: req.session.userId });


  res.render('viewOrders', { orders: orderData, fortotal: fortotal });

}

const orderStatus = async (req, res) => {
  const orderData = await Order.findOne({ _id: req.query.id })
  
  if (orderData.status == 'billed') {
    orderData.status = 'confirmed'
  } else if (orderData.status == 'confirmed') {
    orderData.status = 'delivered'
  }
  const orderstatussave = await orderData.save()
  res.redirect('/admin//order-list')
}

const cancelOrder = async (req, res) => {
  const del = await Order.deleteMany({ _id: req.query.id })
  res.redirect('/admin/order-list')
}


const goBack = async (req, res) => {
  const userData = await User.find({ is_admin: 0 });

  res.render('dashboard', { users: userData });

}
const addCat = async (req, res) => {
  try {
    const category = await Category.find()
    res.render('addCategory', { category: category })
  } catch (error) {
    console.log(error.message);
  }
}

const addCategory = async (req, res) => {
  try {
    const cat = req.body.category
    const isExist = await Category.findOne({ category: cat })
    if (isExist == null && cat != '') {
      const categories = Category({
        category: cat,
      })
      await categories.save()
    } else {
      console.log("Category Exists or Its is null");
    }

    res.redirect('/admin/add-cat')

  } catch (error) {
    console.log(error.message);
  }
}

const delCat = async (req, res, next) => {
  const del = await Category.deleteOne({ _id: req.query.id })
  res.redirect('/admin/add-cat')
}


const adminHome = async (req, res) => {
  try {
    const orderDetail = await Order.find()

    if (isadLogin) {
      const categoryData = await Category.find()

      let categoryNames = [];
      let categoryCount = [];
      for (let key of categoryData) {
        categoryNames.push(key.category);
        categoryCount.push('0');
      }
      let orderHistory = [];

      for (let key of orderDetail) {
        let populatedDetails = await key.populate('items.pid')
        orderHistory.push(populatedDetails)
      }

      // console.log('11',orderHistory);
      for (let i = 0; i < orderDetail.length; i++) {
        for (let j = 0; j < orderDetail[i].items.length; j++) {
          let fetchedCategory = orderDetail[i].items[j].pid.genre;

          let isExisting = categoryNames.findIndex(category => {
            return category === fetchedCategory;
          })

          categoryCount[isExisting]++
        }
      }


      res.render('adminView', { isadLogin, name: categoryNames, count: categoryCount })

    } else {
      let categoryNames = [];
      let categoryCount = [];
      res.render('adminView', { isadLogin, name: categoryNames, count: categoryCount })
    }
  } catch (error) {
    console.log(error.message);
  }
}

const addCop=async(req,res)=>{

  const coupons = await Coupon.find()

  res.render('addCoupon',{coupons:coupons});
}
 

const addcoupon = async (req, res) => {
  try {
      const cop = req.body.couponCode
      const isExist = await Coupon.findOne({ couponCode: cop })
      if (isExist == null && cop != '') {
          const coupons = new Coupon({
              couponCode: req.body.couponCode,
              couponDiscount: req.body.couponDiscount
          })
          await coupons.save()
          res.redirect('/admin/add-cop')
      }else{
          console.log("Coupon Exists or Its is null");
          res.redirect('/admin/add-cop')
      }
  } catch (error) {
      console.log(error.message);
  }
}

const delCoupon = async (req, res) => {
  
  const del = await Coupon.deleteOne({ _id: req.query.id })
  res.redirect('/admin/add-cop')

}


const banner = async (req, res) => {
  try {
      const banner = await Banner.find()
      res.render('bannerManage', { banner: banner })
  } catch (error) {
      console.log(error.message);
  }
}


const addbanner = async (req, res) => {
  try {

    console.log(req.body);
          const banner = new Banner({
              bannerImage: req.file.filename,
              
              bannerHead: req.body.head,
              bannerSub: req.body.sub
          })
          await banner.save()
          const banners = await Banner.find()
          console.log(banners);
          res.render('bannerManage', { banner: banners })
  } catch (error) {
      console.log(error.message);
  }
}



const deleteBanner = async (req, res) => {

  try {
    const id = req.query.id;
    await Banner.deleteOne({ _id: id });
    res.redirect('/admin/view-bann');
  }

  catch (error) {
    console.log(error.message);
  }
}
const salesReport = async(req,res)=>{


  const productData = await Product.find()


  res.render('salesReport',{product:productData});
}
 










module.exports = {

  loadLogin,
  verifyadLogin,
  adlogout,
  blockUser,
  viewProduct,
  editProduct,
  viewPro,
  addPro,
  updateAddProduct,
  upload,
  
  productEdit,
  updateProduct,
  deleteproduct,
  orderList,
  orderStatus,
  cancelOrder,
  goBack,
  addCat,
  addCategory,
  delCat,
  adminHome,
  dashBoard,
  addCop,
  addcoupon,
  delCoupon,
  banner,
  addbanner,
  deleteBanner,
  salesReport
 
  
  

}
