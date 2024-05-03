const express=require('express');
 const user_route=express();

  // set view engine
  user_route.set('view engine', 'ejs');
  user_route.set('views','./views/users');

  const auth=require('../middleware/auth')
 
  // set body parser
  const bodyparser=require('body-parser');
  user_route.use(bodyparser.json());
  user_route.use(bodyparser.urlencoded({extended:true}));

  const userController=require('../controllers/userController');

  const profileController=require('../controllers/profileController');

  const productController=require('../controllers/productController');

  const cartController=require('../controllers/cartController');

  const checkoutController=require('../controllers/checkoutController');

  const wishlistController=require('../controllers/wishlistController');

  const orderController=require('../controllers/orderController');

  // load home
  user_route.get('/',userController.loadhome);

  // load signup
  user_route.get('/signup',auth.userexist,userController.loadSignUp);

  // verify signup
  user_route.post('/signup',userController.verifySignUp);

  // load otp page
  user_route.get('/loadotp',userController.loadotp);

 // verify otp
 user_route.post('/resOtp',userController.verifyotp);

 // load loginpage
 user_route.get('/login',auth.userexist,userController.loadLoginPage);

 // verify login
 user_route.post('/login',userController.verifyUser);

 // load aboutus
 user_route.get('/aboutUs',userController.loadAboutUs);

 // load contact us 
 user_route.get('/contactUs',userController.loadContactUs);

 // load forgotpassword
 user_route.get('/forgotpassword',userController.loadForGotpassword);

  // forgotpassword otp
  user_route.post('/forgotpassword',userController.forgotpasswordOtp);

  // verify forgot pass otp
  user_route.post('/otp',userController.verifiyPassOtp)
 
  // load new password
  user_route.get('/newpassword',userController.loadnewpassword);
 
  // update password
  user_route.post('/passwordVerify',userController.updatepassword);





 // ******** PROFILE *******

 // load profile
 user_route.get('/profile',profileController.loadProfile);

 user_route.post('/editProfile',profileController.editProfile);

 user_route.post('/changePassword',profileController.changePassword);





  // ******** PRODUCT *******

 // load product
 user_route.get('/product',productController.loadProducts);

 // load productdetails
 user_route.get('/productdetails',productController.loadProductDetails);





  // ******** CART *******

 // load cart
 user_route.get('/cart',cartController.loadCart);

 // add cart
 user_route.post('/addCart',cartController.addToCart);

 // remove cart
 user_route.put('/removeCart',cartController.removeCart);

 //add cart 
 user_route.post('/addCartt',wishlistController.addCart);

  // update cart
  user_route.put('/cartUpdate',cartController.cartupdate);

 // logout
 user_route.post('/logout',userController.logout);



  // ******** CHECKOUT *******

 // load checkout
 user_route.get('/checkout',checkoutController.loadCheckout);

 // add checkoutAddress
 user_route.post('/chekoutAddAddress',checkoutController.addAddress);

  // razor
  user_route.post('/razor',checkoutController.razor)



  // ******** WISHLIST *******

 // load wishlist
 user_route.get('/wishlist', wishlistController.loadWishlist);

 // add wishlist
user_route.post('/addWishlist', wishlistController.addWishlist);

// remove wishlist
user_route.put('/removeWishlist', wishlistController.removeWishlist);



// load Oreders
user_route.get('/orders',orderController.loadOrders);

// place order
user_route.post('/getOrder',orderController.placeOrder);

// load orderdeteils
user_route.get('/orderDetails',orderController.loadOrderDetails)




 

  module.exports=user_route;