const Products=require('../models/product_model');
const Category=require('../models/category_model')

// load admin product
const loadProduct=async(req,res)=>{
    try {
       
        const productData=await Products.find({})
        res.render('product',{product:productData})
    } catch (error) {
        console.log(error.message);
    }
}

// load addProduct
const addProduct=async(req,res)=>{
    try {
        res.render('addproduct')
    } catch (error) {
        console.log(error.message);
    }
}

// adding product( post method)
const addingProduct=async(req,res)=>{
    try {
        const {name,price,Category,Stock,Description,images}=req.body
        if(price<0 || Stock <0 || images.length<0){
            res.redirect('/admin/addproduct')
        }else{
            const product=new Products({
                name:name,
                price:price,
                category:Category,
                stock:Stock,
                description:Description,
                images:images

            })
            await product.save();
            res.redirect('/admin/product')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

// load edit Product
const loadEditProduct=async(req,res)=>{
    try {
        const proid=req.query.id
        const productData=await Products.findById(proid)
        const msg=req.flash('msg')
        res.render('editproduct',{productData,msg})
    } catch (error) {
        console.log(error.message);
    }
}

// verify editproduct
const verifyEditProduct=async(req,res)=>{
   
    try {
        console.log('ajajajajaj');
    
        const productId = req.params.id
        
        const {name,price,Category,stock,Description,images}=req.body
        console.log(price,stock);
        
        if( req.body.price <0 || req.body.stock < 0 ){
          req.flash('msg','Stock or Price  negative')
          res.redirect('/admin/editproduct')
        }else{
                
            const newproducts= await Products.findByIdAndUpdate({_id:productId},{$set:{name:name,price:price,category:Category,stock:stock,description:Description,images:images}})
            await newproducts.save();
            res.redirect('/admin/product')
        }
        
         
        
    } catch (error) {
        console.log(error.message);
    }
}

// list product
const listProducts = async(req,res)=>{
    try {
        const productId = req.query.id;
        await Products.findByIdAndUpdate({_id:productId},{$set:{is_Listed:true}});
        res.redirect('/admin/product')
    } catch (error) {
        console.error(errror.message);
    }
}

// unlistproducts
const unlistProducts = async(req,res)=>{
    try {
        const productId = req.query.id;
        await Products.findByIdAndUpdate({_id:productId},{$set:{is_Listed:false}});
        res.redirect('/admin/product')
    } catch (error) {
        console.error(errror.message);
    }
}



// **** USER SIDE ****

const loadProducts=async(req,res)=>{
    try {
        const category = await Category.find({is_Listed : true})
        const user=req.session.user
        const products=await Products.find({status: true,is_Listed:true})
        res.render('product',{categoryData:category,products,user})
    } catch (error) {
        console.log(error.message);
    }
}

//load product details
const loadProductDetails = async(req,res)=>{
    try {
        const user=req.session.user 

        const productId = req.query.id;

        const products=await Products.findOne({_id:productId})

        const category = await Category.find({is_Listed : true})

        res.render('productdetails',{categoryData : category,user,productDetails:products})

    } catch (error) {
        console.error(error.message);
    }
}



module.exports={
    loadProduct,
    addProduct,
    addingProduct,
    loadEditProduct,
    listProducts,
    unlistProducts,
    loadProducts,
    loadProductDetails,
    verifyEditProduct
}