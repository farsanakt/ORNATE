const User=require('../models/user_model');

const Wishlist=require('../models/wishlist_model');

const Product=require('../models/product_model');

const Category=require('../models/category_model');

const Cart=require('../models/cart_model');

// loadWishlist
const loadWishlist=async(req,res)=>{

         const user=req.session.user
    try {

        const category=await Category.find({is_Listed:true})

        if(req.session.user){
           
            const userIdd=req.session.user
            
            const wishlistData=await Wishlist.findOne({userId:userIdd}).populate('products.productId');

            console.log(wishlistData,'loop');

            if(wishlistData){
                console.log('akkka')
                const productStatus=wishlistData.products.filter(val=>val.productId.status==false);
                
                if(productStatus.length > 1){

                    for(const product of productStatus){

                        var newData =await Wishlist.findByIdAndUpdate({userId:userIdd},{$pull:{products:{productId:product.productId._id}}},{new :true}).populate('products.productId');

                    }

                    res.render('wishlist',{login:req.session.user,wishlistData:newData,categoryData:category,user})

                }
            }else{
                    

                res.render("wishlist", { login: req.session.user, wishlistData ,categoryData:category,user});
            }

        }else{

            res.redirect('/login')

        }
    } catch (error) {

        console.log(error.message);
    }
}

// add wishlist
const addWishlist = async (req, res) => {
    
    try {
        
        const proIdd = req.query.id

        console.log(proIdd);

        const userIdd = req.session.user

        const exist = await Wishlist.findOne({ userId: userIdd, products: { $elemMatch: { productId: proIdd } } })

        if (!exist) {
             
            await Wishlist.findOneAndUpdate({ userId: userIdd }, { $addToSet: { products: { productId: proIdd } } }, { upsert: true });
            
            res.send({ succ: true });
           
        } else {

            res.send({ suc: true });
        }

    } catch (error) {

        console.log(error.message);
        
        res.status(500).send({ suc: false, message: 'Internal Server Error' });
        
    }

};

//  removeWishlist (Put Method) :-

const removeWishlist = async (req, res) => {

    console.log('hiiiiiiii');
    try {
        const proId = req.query.id;

        const removeWishlistt = await Wishlist.findOneAndUpdate({ userId: req.session.user }, { $pull: { products: { productId: proId } } });

        if (removeWishlistt) {

            res.json({ suc: true });

        } else {

            res.json({ fail: true });

        }
    } catch (error) {

        console.error(error.message);

        res.status(500).json({ error: 'Internal server error' });
    }
};

//  addCart (Post Method) :-

const addCart = async (req, res) => {
    
    try {
         console.log('jjjjjjjjjjjjjjjjjjjjjj');

        const proIdd = req.query.id

        const userIddd = req.session.user

        const proData = await Product.findOne({ _id: proIdd });
        
        const exist = await Cart.findOne({ userId: userIddd, products: { $elemMatch: { productId: proIdd } } });

        const price=proData.offerPrice?proData.offerPrice:proData.price
            
    

        const qty = 1

        if (!exist) {
            
            await Cart.findOneAndUpdate({ userId: userIddd }, { $addToSet: { products: { productId: proIdd, price: price, quantity: qty } } }, { upsert: true, new: true });
            
            await Wishlist.findOneAndUpdate({ userId: userIddd }, { $pull: { products: { productId: proIdd } } }, { new: true });

            res.send({ suc: true });

        } else {

            res.send({ fail: true });

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

};


module.exports={
    loadWishlist,
    addWishlist,
    removeWishlist,
    addCart
}