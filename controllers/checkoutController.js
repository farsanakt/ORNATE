const Cart=require('../models/cart_model');
const Address=require('../models/address_model');
const Category=require('../models/category_model');
const instance=require('../config/razorPay');

const User=require('../models/user_model')

const loadCheckout=async(req,res)=>{
    try {
        const category = await Category.find({is_Listed : true})
         const user=req.session.user
        
         if(req.session.user){
            const userIdd=req.session.user
            const cartData=await Cart.findOne({userId:userIdd}).populate('products.productId')
            console.log(cartData,'ithhh');
            const addres=await Address.findOne  ({userId:userIdd})
             
            const userData=await User.find({_id:userIdd})

            console.log(addres);

            res.render('checkout',{categoryData:category,cartData,addres,userData,user})
         }else{
                 res.redirect('/login')
         }
          
       
    } catch (error) {
        console.log(error.message);
    }
}

// add address at checkout
const  addAddress=async(req,res)=>{
    try {
        console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
        const user = req.session.user
        
        const addressData=await Address.findOne({userId:user,addresss:{$elemMatch:{address:req.body.addressData.addresss}}})
        if(!addressData){
            const verifyData = await Address.findOneAndUpdate({userId : user} , {$addToSet : {addresss : {

                name : req.body.addressData.name,
                phone : req.body.addressData.phone,
                loacality : req.body.addressData.locality,
                city : req.body.addressData.city,
                states : req.body.addressData.state,
                pincode : req.body.addressData.pincode,
                address : req.body.addressData.address,
                status : true
            
            }}} , {upsert : true , new : true})

            res.send({suc : true})
        }else{
            res.send({fail : true})
        }
    } catch (error) {
        console.log(error.message);
    }
}


// razor
const razor = async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.session.user })

        const amount = req.body.amount * 100

        const options = {
            amount: amount,
            currency: "INR",
            receipt: 'ffarsanakt@gmail.com'
        }

        instance.orders.create(options, (err, order) => {

            if (!err) {
                res.send({
                    succes: true,
                    msg: 'ORDER created',
                    order_id: order.id,
                    amount: amount,
                    key_id: process.env.RAZORPAY_IDKEY,
                    name: user.fullName,
                    email: user.email
                })

            } else {

                console.error("Error creating order:", err);
                res.status(500).send({ success: false, msg: "Failed to create order" });

            }
        })
    } catch (err) {
        console.log(err.message + '     razor')
    }
}

module.exports={
    loadCheckout,
    addAddress,
    razor
}