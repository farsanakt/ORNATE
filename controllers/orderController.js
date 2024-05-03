const User=require('../models/user_model');

const Category=require('../models/category_model');

const Order=require('../models/order_model');

const Product=require('../models/product_model');

const Cart=require('../models/cart_model');

const Address=require('../models/address_model')


// ******* USER ******

// load order (profile)
const loadOrders=async(req,res)=>{
    try {
        const user=req.session.user

        const userIdd=req.session.user

        const category=await Category.find({is_Listed:true})

        const orderData=await Order.find({userId:userIdd}).populate('products.productId')

        res.render('orders',{user,categoryData:category,orderData})

        
    } catch (error) {

        console.log(error.message);
    }
}


// placing order(checkout)
const placeOrder=async(req,res)=>{
    try {
        userIdd=req.session.user

        const category=await Category.find({is_Listed:true})

        const cartData=await Cart.findOne({userId:userIdd});

        const addressData=await Address.findOne({userId:userIdd, 'addresss.status':true});

        console.log(addressData,'ithan ath');

        if(!addressData){

            return res.status(400).send('No active address found for the user');

        }

        const newOrder = new Order({

            userId: userIdd,

            orderAmount: cartData.totalCartPrice,

            payment: 'COD',

            deliveryAddress: addressData.addresss[0],

            products: cartData.products.map(product => ({

                productId: product.productId,

                quantity: product.quantity,

                price: product.price,

                orderProStatus: 'pending' 

            }))
        });

        await newOrder.save();

        if(newOrder){

            newOrder.products.forEach(async(e) => {

                const productData=await Product.findOne({_id:e.productId});

                const newStock=productData.quantity-e.quantity;

                await Product.findOneAndUpdate({_id:e.productId},{$set:{quantity:newStock}});
                
            });
        }
          await Cart.findOneAndDelete({userId:userIdd});

         res.render('confirmation',{login:req.session.user,categoryData:category})

    } catch (error) {

        console.log(error.message);
    }
}

// loadOrderDetails
const loadOrderDetails=async(req,res)=>{
    try {
        const userIdd=req.session.user
        const category=await Category.find({is_Listed:true})
        const orderDetails=await Order.findOne({userId:userIdd}).populate('products.productId')
        console.log(orderDetails,'uuuuuuuuuuuuuuuuuuuu');
        res.render('orderDetails',{categoryData:category,orderDetails})
        
    } catch (error) {
        console.log(error.message);
    }
}


// ********* ADMIN SIDE *******
const loadOrderss=async(req,res)=>{
    try {
        const orderData=await Order.find({})
        res.render('order',{orderData})
    } catch (error) {
        console.log(error.message);
    }
}

const loadOrderDetaills=async(req,res)=>{
    try {
        const userIdd=req.session.user
        const orderDetails=await Order.findOne({_id:req.query.id}).populate('products.productId')

        console.log(orderDetails);

        const Userdetail=await User.findOne({_id:userIdd})
        console.log(orderDetails);
        res.render('orderDetails',{orderDetails,Userdetail})
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    loadOrders,
    placeOrder,
    loadOrderDetails,
    loadOrderss,
    loadOrderDetaills
}