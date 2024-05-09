const User=require('../models/user_model');

const Category=require('../models/category_model');

const Order=require('../models/order_model');

const Product=require('../models/product_model');

const Cart=require('../models/cart_model');

const Address=require('../models/address_model');

const Coupen=require('../models/coupen_model');

const Wallet=require('../models/wallet_model')


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
        
        const category=await Category.find({is_Listed:true});

        const cartData=await Cart.findOne({userId:userIdd});

        let total=cartData.totalCartPrice;

        if(req.session.offer)  total=parseInt(total/100*(100-req.session.offer));

        const addressData=await Address.findOne({userId:userIdd, 'addresss.status':true});

        console.log(addressData,'ithan ath');

        if(!addressData){

            return res.status(400).send('No active address found for the user');

        }

        const newOrder = new Order({

            userId: userIdd,

            orderAmount:total ,

            payment: req.body.paymentmethod,

            deliveryAddress: addressData.addresss[0],

            products: cartData.products.map(product => ({

                productId: product.productId,

                quantity: product.quantity,

                price: product.price,

                orderProStatus: 'pending' 

            }))

        });

        //  For Wallet :-

        const wallett = await Wallet.findOne({userId : userIdd});

        if(req.body.paymentmethod=='wallet' &&  total <= wallett.balance || null){

            const walletData = await Wallet.findOneAndUpdate({userId:userIdd }, {$inc : {balance : -total} , $push : {transaction : {amount : total , creditOrDebit : 'debit'}}} , {new : true , upsert : true});
            

        }

        const coupen= await Coupen.find({above:{$lte:cartData.totalCartPrice}})
    
        if(coupen.length>0 && !req.session.offer) {

            coupen.forEach(async(e)=>{

                const coupen1= await User.findOne({_id: userIdd ,coupen:{$elemMatch:{coupenId:e._id}}});

                if(!coupen1){

                    await User.findOneAndUpdate({_id: userIdd},{$addToSet:{coupen:{coupenId:e._id}}});

                    return;
                }

            })
       
    }
      
        await newOrder.save();

        if(req.session.offer){

               delete req.session.offer;

               const user=await User.findOne({_id: userIdd });

                const removeCoupen=await User.findOneAndUpdate({_id: userIdd },{$pull:{coupen:{_id:req.session.coupen}}})

               delete req.session.coupen;      
        }

        if(newOrder){

            newOrder.products.forEach(async(e) => {

                const productData=await Product.findOne({_id:e.productId});

                productData.stock-=e.quantity;

                await productData.save()
                
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
        const user=req.session.user

        const userIdd=req.query.id

        const userData=await User.findById({_id:userIdd})
    
        const category=await Category.find({is_Listed:true})

        const order=await Order.findOne({_id:userIdd}).populate('products.productId')

        res.render('orderDetails',{categoryData:category,order,user,userData})
        
    } catch (error) {
        console.log(error.message);
    }
}

// cancel order
const cancelOrder = async (req, res) => {
    try {
        const { orderId, productId, selectedReason } = req.body;

        const cancelData = await Order.findOneAndUpdate(

            { _id: orderId, 'products.productId': productId }, 

            {
                $set: {
                    'products.$.orderProStatus': 'canceled', 
                    'products.$.reason': selectedReason 
                }
            },
            { new: true }
        )
       
        if(cancelData){

            const canceledItem = cancelData.products.find(item => item.productId.equals(productId))
            
            const canceledQuantity = canceledItem.quantity;
            
            const product = await Product.findById(productId)
            
            product.stock += canceledQuantity;
           
            await product.save();

            res.json({ success: true });
        }
        
    } catch (error) {

        console.log(error.message);
       
    }
};

// return order
const returnOrder= async (req,res)=>{
    try {
         
        const userIdd=req.session.user

        const { orderId,productId,selectedReason}=req.body
        
        const returnData=await Order.findOneAndUpdate(

            {_id:orderId,'products.productId':productId},

            {$set:{'products.$.reason':selectedReason,apporved:1}},

            {new :true} 
        )
      
        

        if(returnData){
           res.json({success:true})

        }

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

// load orderdetails
const loadOrderDetaills=async(req,res)=>{
    try {
        const userIdd=req.session.user

        const ordId = req.query.id
        
        const ordDettails=await Order.findOne({_id:req.query.id}).populate('products.productId');
 
        const Userdetail=await User.findOne({_id:userIdd})
     
        res.render('orderDetails',{ordDettails,Userdetail,ordId})

    } catch (error) {

        console.log(error.message);

    }
}

// order Status
const orderStatus=async(req,res)=>{
    try {
        
        const {orderDetailsId, productId, newStatus}=req.body
        
        const changeStatus = await Order.findOneAndUpdate(
            {
                _id: orderDetailsId,
                'products.productId': productId
            },
            {
                $set: {
                    'products.$.orderProStatus': newStatus
                }
            },
            {
                new: true
            }
        );
        
        if (changeStatus) {
            res.json({success:true})
        }

    } catch (error) {
        console.log(error.message);
    }
}

// aprove order 
const approveReturn=async(req,res)=>{
    try {
        const { orderId,productId}=req.body;

        console.log(typeof orderId,typeof productId);


        const approvedData = await Order.findOneAndUpdate(

            { _id: orderId, 'products.productId': productId },

            {$set:{'products.$.orderProStatus':"returned",apporved:2}},

            {new :true} 
        );

                if(approvedData.payment=="online payment"){

                const walletData=await Wallet.findOneAndUpdate({userId:userIdd},{$set:{balance:approvedData.orderAmount},$push:{transaction:{amount:approvedData.orderAmount,creditOrDebit:'credit'}}},{new:true,upsert:true})
                console.log(walletData);
                }

        if(approvedData){

            const returnedItem = approvedData.products.find(item => item.productId.equals(productId))

            const returnedQuantity = returnedItem.quantity;

            const reason=returnedItem.reason

            if(reason!=='Defective or Damaged Product'){

                const product = await Product.findById(productId)
            
                product.stock += returnedQuantity;

                await product.save();

            }

            res.json({success:true})
            
        }
    } catch (error) {
        console.log(error.message);
    }

}


// decalin order 
const decalinReturn=async(req,res)=>{
    try {
        const { orderId,productId}=req.body

        console.log(typeof orderId,typeof productId);

        const decalinedData = await Order.findOneAndUpdate(

            { _id: orderId, 'products.productId': productId },

            {$set:{apporved:3}},

            {new :true} 
        );

        if(decalinedData){

       res.json({success:true})

}

    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    loadOrders,
    placeOrder,
    loadOrderDetails,
    loadOrderss,
    loadOrderDetaills,
    cancelOrder,
    orderStatus,
    returnOrder,
    approveReturn,
    decalinReturn
    
}