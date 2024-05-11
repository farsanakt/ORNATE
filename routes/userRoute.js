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

  const coupenController=require('../controllers/coupenController');

  const addressController=require('../controllers/addressController');



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

  //Resend OTP
  user_route.get('/resendotp',userController.resendotp)
 
  // load new password
  user_route.get('/newpassword',userController.loadnewpassword);
 
  // update password
  user_route.post('/passwordVerify',userController.updatepassword);

  //  wallet
  user_route.get('/wallet', userController.loadWallet);





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

 user_route.post('/addcoupen',checkoutController.addCoupen)

  // razor
  user_route.post('/razor',checkoutController.razor);

  // choose address
  user_route.post('/chooseAddress',checkoutController.chooseAddress)



  // ******** WISHLIST *******

 // load wishlist
 user_route.get('/wishlist', wishlistController.loadWishlist);

 // add wishlist
user_route.post('/addWishlist', wishlistController.addWishlist);

// remove wishlist
user_route.put('/removeWishlist', wishlistController.removeWishlist);



// ******** ORDERS *******

// load Oreders
user_route.get('/orders',orderController.loadOrders);

// place order
user_route.post('/getOrder',orderController.placeOrder);

// load orderdeteils
user_route.get('/orderDetails',orderController.loadOrderDetails);

// load Coupen
user_route.get('/userCoupen',coupenController.loadCoupens);

// cancel order
user_route.post('/cancelOrder',orderController.cancelOrder);

// return order
user_route.post('/returnOrder',orderController.returnOrder)



// ******** PROFILE ADDRESS *******
user_route.get('/profileaddress',addressController.loadAddress);

user_route.post('/addAddress',addressController.verifyProfileAddAddess);

 // deleteaAdderss
 user_route.post('/deleteAdd' , addressController.deleteaAdderss);

 // editprofileaddress
 user_route.put('/editAddress',addressController.editprofileaddress);
 
 // verifyEditAddress
 user_route.post('/verifyEditAddress',addressController.verifyEditAddress);

// sort
 user_route.get('/sort/:criteria',productController.sortProduct);

 // search
 user_route.post('/search',productController.searchName)

 user_route.post('/filterproducts',productController.filterProducts)


  module.exports=user_route;