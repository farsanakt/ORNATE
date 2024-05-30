const Cart=require('../models/cart_model');

const Address=require('../models/address_model');

const Category=require('../models/category_model');

const instance=require('../config/razorPay');

const Coupen=require('../models/coupen_model')

const User=require('../models/user_model')

const loadCheckout=async(req,res)=>{
    try {
        const category = await Category.find({is_Listed : true})

         const err=req.flash('err')

         const user=req.session.user

         const msg=req.session.offer?'coupen applied':req.flash('msg');

        const offer=req.session.offer

         if(req.session.user){

            const userIdd=req.session.user

            const cartData=await Cart.findOne({userId:userIdd}).populate('products.productId')

            console.log(cartData,'ithhh')

            const addres=await Address.findOne  ({userId:userIdd})
             
            const userData=await User.find({_id:userIdd})

            console.log(addres);


            res.render('checkout',{categoryData:category,cartData,addres,userData,user,msg,err,offer})
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
        console.log('df');

        const user = await User.findOne({ _id: req.session.user })
        console.log(user);

        let amount = req.body.amount * 100

        if(req.session.offer) amount=parseInt(amount/100*(100-req.session.offer))

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


// add Coupen(post method)
const addCoupen=async(req,res)=>{
    try {
        
        const cpId=req.body.couponId

        const findCoupon=await User.findOne({_id:req.session.user,'coupen._id':cpId},{'coupen.$':1}).populate('coupen.coupenId').catch((err)=>{
            req.flash('msg','coupen not existing')
      
            res.redirect('/checkout')
        })

        if(!findCoupon){

        req.flash('msg','coupen not existing')
      
        res.redirect('/checkout')

       }else{
        const currentCoupen=await Coupen.findOne({_id:findCoupon.coupen[0].coupenId._id})
        req.session.offer=currentCoupen.discount;
        console.log(currentCoupen.discount,'jjjjjjjj');
        req.session.coupen=cpId
        req.flash('msg','coupen applied')
      
        res.redirect('/checkout')
       }
       
    } catch (error) {
        
        console.log(error.message);
    }
}

// choose address
const chooseAddress=async(req,res)=>{
    try {
        const userId=req.session.user
        const adId=req.query.id
        console.log(adId);
        await Address.updateMany(
            { userId: userId, 'addresss.status': true },
            { $set: { 'addresss.$.status': false } }
        );

        const changeAddress = await Address.findOneAndUpdate({userId:userId,'addresss._id':adId},{$set:{'addresss.$.status':true}});
        console.log(changeAddress);
        if(changeAddress){
            res.send({response:ok})
        }


    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    loadCheckout,
    addAddress,
    addCoupen,
    razor,
    chooseAddress
}