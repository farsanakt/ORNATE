const User=require('../models/user_model');

const Category=require('../models/category_model');

const Order=require('../models/order_model');

const Product=require('../models/product_model');

const Cart=require('../models/cart_model');

const Address=require('../models/address_model');

const Coupen=require('../models/coupen_model');

const Wallet=require('../models/wallet_model')


// generate orderId
function generateOrdId() {
    
    const chars = 'ABCDEFGTUVWXYZ'
    
    const randomIndex = Math.floor(Math.random() * chars.length)
    
    const randomChar = chars[randomIndex]

    const min = 10000000
    const max = 99999999

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    
    const orderId = randomChar + randomNumber.toString();
    
    return orderId.toUpperCase(); 
}


// ******* USER ******

// load order (profile)
const loadOrders = async (req, res) => {
    try {

        const user = req.session.user

        const userIdd = req.session.user

        const category = await Category.find({ is_Listed: true })

        const userData = await User.findOne({ _id: user })
        
        const orderDat = await Order.find({ userId: userIdd }).populate('products.productId')
        const orderData = [...orderDat].reverse()

        const limit = 5

        const max = 5

        const totalPages = Math.ceil(orderData.length / limit)

        let currentPage = req.query.page? Number(req.query.page) : 1

        if (currentPage < 1 || currentPage > totalPages) {

            currentPage = 1
        }

        const startIndex = (currentPage - 1) * limit

        const endIndex = startIndex + limit

        const paginatedOrders = orderData.slice(startIndex, endIndex)
        
        const startPage = Math.max(currentPage - Math.floor(max / 2), 1)

        const endPage = Math.min(startPage + max - 1, totalPages);

        res.render('orders', { user, categoryData: category, orderData: paginatedOrders, totalPages, currentPage, startPage, endPage })

    } catch (error) {

        console.log(error.message)

    }
};



// placing order(checkout)
const placeOrder=async(req,res)=>{
    try {
        userIdd=req.session.user
        
        const category=await Category.find({is_Listed:true});

        const cartData=await Cart.findOne({userId:userIdd});

        let total=cartData.totalCartPrice;

        let payment=req.body.paymentmethod

        console.log(payment,'loop');

        let discounts = 0;

        console.log(discounts);
        
        if(req.session.offer)  {
            
            discounts=parseInt(total-(total*(req.session.offer/100)))

            total=parseInt(total*(req.session.offer/100));
            
        }

        const addressData=await Address.findOne({userId:userIdd, 'addresss.status':true});

        console.log(addressData,'ithan ath');

        if(!addressData){

            return res.status(400).send('No active address found for the user');

        } 

        if(payment=== 'cod' && total>=1000){

            req.flash('err','cod is not availble for this order')

            res.redirect('/checkout')

            return
        }

        const newOrder = new Order({

            userId: userIdd,

            orderAmount:total ,

            payment: req.body.paymentmethod,

            discount:discounts,

            orderId:generateOrdId(),

            deliveryAddress: addressData.addresss[0],

            products: cartData.products.map(product => ({

                productId: product.productId,

                quantity: product.quantity,

                price: product.price,

                orderProStatus: 'pending' 

               

            }))

        });

        for(let sinPro of cartData.products){
            
            const countPro=await Product.findOne({_id:sinPro.productId._id})
            console.log(countPro,'faadi');
           
            countPro.count+=sinPro.quantity
            console.log(countPro.count,'oppp');

            await countPro.save()

            const countCat=await Category.findOne({name:countPro.category})
            console.log(countCat,'opp');
            
            countCat.count+=sinPro.quantity
            console.log(countCat.count,'kk');
            
            await countCat.save()
        }


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

        const userDataa=await Order.findOne({userId:user})

        const userData=await User.findById({_id:userIdd})
    
        const category=await Category.find({is_Listed:true})

        const order=await Order.findOne({_id:userIdd}).populate('products.productId')

        res.render('orderDetails',{categoryData:category,order,user,userData,userDataa})
        
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
        console.log(cancelData,'poooo')
       
        if(cancelData){

            const canceledItem = cancelData.products.find(item => item.productId.equals(productId))
            
            const canceledQuantity = canceledItem.quantity;
            
            const product = await Product.findById(productId)
            
            product.stock += canceledQuantity;
           
            await product.save();

            if(cancelData.payment=='online payment' || cancelData.payment=='walle' ){

                let singlePrice=product.price*canceledQuantity

                const wallettData=await Wallet.findOne({userId:req.session.user})

                if(wallettData){

                    wallettData.balance+=singlePrice

                    wallettData.transaction.push({

                        amount:singlePrice,

                        creditOrDebit:'credit'

                    })

                    await wallettData.save()

                }else{

                    const walWallet=new Wallet({

                        userId:req.session.user,

                        balance :singlePrice,

                        transaction:[{

                            amount:singlePrice,

                            creditOrDebit:'credit'
                        }]
                    }) 
                    await walWallet.save()
                }
            }

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

//razorpayement failed
const failedPayment=async(req,res)=>{
    try {
        userIdd=req.session.user
        
        const category=await Category.find({is_Listed:true});

        const cartData=await Cart.findOne({userId:userIdd});

        let total=cartData.totalCartPrice;

        let payment=req.body.paymentmethod

        console.log(payment,'loop');

        let discounts = 0;

        console.log(discounts);
        
        if(req.session.offer)  {
            
            discounts=parseInt(total-(total*(req.session.offer/100)))

            total=parseInt(total*(req.session.offer/100));
            
        }

        const addressData=await Address.findOne({userId:userIdd, 'addresss.status':true});

        console.log(addressData,'ithan ath');

        if(!addressData){

            return res.status(400).send('No active address found for the user');

        } 

        if(payment=== 'cod' && total>=1000){

            req.flash('err','cod is not availble for this order')

            res.redirect('/checkout')

            return
        }

        const newOrder = new Order({

            userId: userIdd,

            orderAmount:total ,

            payment: req.body.paymentmethod,

            discount:discounts,

            orderId:generateOrdId(),

            paymentStatus:'failed',

            deliveryAddress: addressData.addresss[0],

            products: cartData.products.map(product => ({

                productId: product.productId,

                quantity: product.quantity,

                price: product.price,

                orderProStatus: 'pending' 
        
               

            }))

        });

        for(let sinPro of cartData.products){
            
            const countPro=await Product.findOne({_id:sinPro.productId._id})
           
            countPro.count+=sinPro.quantity

            await countPro.save()

            const countCat=await Category.findOne({name:countPro.category})
            
            countCat.count+=sinPro.quantity
            
            await countCat.save()
        }


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

// continuePayment(post method)
const continuePayment=async(req,res)=>{
    try {
        const userId=req.session.user
         
        const ordId=req.body.orderid

        const order=await Order.findOneAndUpdate({userId:userId,_id:ordId},{paymentStatus:'success'},{new:true})

        if(order){
            res.json({success:true})
        }
    } catch (error) {
        console.log(error.message);
    }
}



// ********* ADMIN SIDE *******
const loadOrderss = async (req, res) => {
    try {
        const limit = 7

        const max = 5 

        const orderDat = await Order.find({})

        const orderData=[...orderDat].reverse()

        const totalPages = Math.ceil(orderData.length / limit)

        let currentPage = req.query.page? Number(req.query.page) : 1

        if (currentPage < 1 || currentPage > totalPages) {
            currentPage = 1
        }

        const startIndex = (currentPage - 1) * limit

        const endIndex = startIndex + limit

        const paginatedOrders = orderData.slice(startIndex, endIndex)

        const startPage = Math.max(currentPage - Math.floor(max / 2), 1)

        const endPage = Math.min(startPage + max - 1, totalPages)
        
        res.render('order', { orderData: paginatedOrders, totalPages, currentPage, startPage, endPage })

    } catch (error) {

        console.log(error.message)

    }
};


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
    decalinReturn,
    failedPayment,
    continuePayment
    
}