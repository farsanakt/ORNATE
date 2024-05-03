const express=require('express')
const admin_route=express();


const admin_auth=require('../middleware/admin_auth')


 // set view engine
 admin_route.set('view engine', 'ejs')
 admin_route.set('views','./views/admin');


  // set body parser
  const bodyparser=require('body-parser');
  admin_route.use(bodyparser.urlencoded({extended:true}));
  admin_route.use(bodyparser.json());

  const adminController=require('../controllers/adminController');

  const productController=require('../controllers/productController');

  const categoryController=require('../controllers/categoryController');

  const ordersController=require('../controllers/orderController')


  // load dashbord
  admin_route.get('/dashbord',admin_auth.adminnotexist,adminController.loadDashbord);

  // load userlist
  admin_route.get('/userlist',adminController.loadUserList);

  // load admi n login
  admin_route.get('/',admin_auth.adminexist,adminController.loadLogin);

  // load dashbord
  admin_route.post('/dashbord',adminController.verifyAdmin);

   // load block
   admin_route.get('/block',admin_auth.adminnotexist,adminController.loadblock);

   //loadunblock
   admin_route.get('/unblock',admin_auth.adminnotexist,adminController.loadunblock);

   // ********PRODUCT********

   admin_route.get('/product',productController.loadProduct);
   
   // load add product(get method)
   admin_route.get('/addproduct',productController.addProduct);

   // load adding prodcut(post method)
   admin_route.post('/addproduct',productController.addingProduct);

   // load editProduct
   admin_route.get('/editproduct',productController.loadEditProduct);

   // editing product (post method)
   admin_route.post('/editProduct/:id',productController.verifyEditProduct);

   // listing product
   admin_route.get('/list',admin_auth.adminnotexist,productController.listProducts);
   
   //unlisting product
   admin_route.get('/unlist',admin_auth.adminnotexist,productController.unlistProducts);



    // ********CATEGORY********
    admin_route.get('/category',categoryController.loadCategory);

    // addcategory
    admin_route.post('/addcategory',categoryController.addcategory);

    admin_route.put('/categoryAction',categoryController.categoryAction);

    // edit category
    admin_route.put('/categoryEdit',categoryController.editcategory);

    // ********ORDERS********

    // load orderr
    admin_route.get('/order',ordersController.loadOrderss);

    // load orderDetails
    admin_route.get('/orderDtails',ordersController.loadOrderDetaills)



  module.exports=admin_route;
