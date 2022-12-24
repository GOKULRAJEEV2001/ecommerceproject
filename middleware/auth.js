const isLogin = async(req,res,next)=>{

    try {

        if(req.session.userId) {
          next()
        }

        else {

            res.redirect('/login');
        }

    }
      catch(error){

        console.log(error.message);


      }
}

const isLogout = async(req,res,next)=>{

    try {

        if(req.session.userId){

            res.redirect('/');
        }

        next();

    }
      catch(error){

        console.log(error.message);


      }
}

const isadLogin = async(req,res,next)=>{

  try {
      
      if(req.session.email) {
        next()
      }

      else {
          console.log(req.session.email);
          res.redirect('/admin/adlogin');
      }

  }
    catch(error){

      console.log(error.message);


    }
  }

module.exports = {

    isLogin,
    isLogout,
    isadLogin
}


