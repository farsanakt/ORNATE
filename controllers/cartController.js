const Cart=require('../models/cart_model');

const Products=require('../models/product_model');

const Category=require('../models/category_model');

const Coupen=require('../models/coupen_model')

const User = require('../models/user_model')


// load cart
const loadCart=async(req,res)=>{
    try {

        const user=req.session.user

        const userIdd=req.session.user

        const category = await Category.find({is_Listed : true})

        const userData=await User.findOne({_id:user})

      
        if(req.session.user){
           
            const cartData = await Cart.findOne({userId:userIdd}).populate('products.productId');

            if( category && cartData && cartData.products && cartData.products.length > 0){

                const total = cartData.products.reduce((acc, product) => {

                    let price1=product.offerPrice?product.offerPrice:product.price

                    const price = Number(price1);

                    return isNaN(price) ? acc : acc + price;
                }, 0);

                const totalCartAmount = await Cart.findOneAndUpdate({userId:user},{$set:{totalCartPrice:total}},{new:true ,upsert:true});

                res.render('cart',{login:req.session.user , categoryData:category , userData, cartData:cartData ,user, totalCartPrice:totalCartAmount.totalCartPrice});

            } else {

                res.render('cart',{login:req.session.user ,user, userData, categoryData:category , totalCartPrice:0});

            }
        } else {

            res.render('login',{categoryData:category,user});

        }
           
    } catch (error) {
        console.log(error.message);
    }
}

// add to cart
const addToCart=async(req,res)=>{
    try {
        const proId=req.query.id
       
        const userIdd=req.session.user
        
        const qty = req.body.qty || 1

        const productData=await Products.findOne({_id:proId})

        const exist=await Cart.findOne({userId:userIdd, products:{$elemMatch:{productId:proId}}});
        
         if(!exist){

            const price=productData.offerPrice?productData.offerPrice:productData.price
            
            const proPrice  = price * qty

            const newCart = await Cart.findOneAndUpdate({userId : userIdd} , {$addToSet : {products : {productId : proId , quantity : qty , price : proPrice}}} , {upsert : true , new : true});

            res.send({succ : true})

        } else {

            res.send({fail : true})

        }
         
    } catch (error) {
        console.log(error.message);
    }
}

//  remove Cart

const removeCart = async(req , res)=>{

    try {

        const proIdd = req.query.id
        
        const removeCart = await Cart.findOneAndUpdate({userId : req.session.user} , {$pull : {products : {productId : proIdd}}});

        if(removeCart){

            res.send({succ : true})

        } else {

            res.send({fail : true})

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

};


// updatecart
const cartupdate=async(req,res)=>{
    try {

        const productId = req.body.productId

        const cartId = req.body.cartId

        const quantity = req.body.quantity
        
        const product = await Products.findOne({ _id: productId });

        const price=product.offerPrice?product.offerPrice:product.price
        
        const newValue = price * quantity;
  
        const updatedCart = await Cart.findOneAndUpdate({ _id: cartId, "products.productId": productId }, { $set: { "products.$.price": newValue, "products.$.quantity": quantity, }, }, { new: true });
       
        const totalCartPrice = updatedCart.products.reduce((acc, product) => acc + product.price, 0);

        await Cart.findOneAndUpdate({ _id: cartId },  { $set: { totalCartPrice: totalCartPrice } });

        res.send({ success: totalCartPrice });

    } catch (error) {

        console.log(error.message);
    }
}




module.exports={
    loadCart,
    addToCart,
    removeCart,
    cartupdate,
   
}