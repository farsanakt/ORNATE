const Products=require('../models/product_model');

const Category=require('../models/category_model');

const Offer = require('../models/offer_modal');

const User =require('../models/user_model')


// load admin product
const loadProduct = async (req, res) => {
  try { 

     let limit =4

      const productData = await Products.find({})

      const totalPages = Math.ceil(productData.length / limit)

      let currentPage = req.query.page? Number(req.query.page) : 1

      // Validate page number

      if (currentPage < 1 || currentPage > totalPages) {
          currentPage = 1;
      }
      
      const startIndex = (currentPage - 1) * limit

      const endIndex = startIndex + limit

      const paginatedProducts = productData.slice(startIndex, endIndex)

      res.render('product', { product: paginatedProducts, totalPages, currentPage })

  } catch (error) {

      console.log(error.message)
      
  }
};

// load addProduct
const addProduct=async(req,res)=>{
    try {

        const categoryData=await Category.find({is_Listed:true})
        
        res.render('addproduct',{categoryData})

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

        const categoryData=await Category.find({is_Listed:true})

        const productData=await Products.findById(proid)

        const msg=req.flash('msg')

        res.render('editproduct',{productData,msg,categoryData})

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

          res.redirect(`/admin/editproduct?id=${productId}`)

        }else{
                
            const newproducts= await Products.findByIdAndUpdate({_id:productId},{$set:{name:name,price:price,category:Category,stock:stock,description:Description,images:images,offerPrice:null}})

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

const loadProducts = async (req, res) => {
    try {

        const category = await Category.find({ is_Listed: true })

        const user = req.session.user;

        const userData = await User.findOne({ _id: user })

        const products = await Products.find({ status: true, is_Listed: true })

        const offerData = await Offer.find().populate('category')

        let limit=6
        
        const totalPages = Math.ceil(products.length / limit)
    
        let currentPage = req.query.page? Number(req.query.page) : 1;
        

        if (currentPage < 1 || currentPage > totalPages) {

            currentPage = 1;
        }


        const paginatedProducts = products.slice((currentPage - 1) * limit, currentPage * limit)

        res.render('product', { categoryData: category, products: paginatedProducts, user, offerData, userData, totalPages, currentPage })

    } catch (error) {

        console.log(error.message);
        
    }
};

//load product details
const loadProductDetails = async(req,res)=>{
    try {
        const user=req.session.user 

        const productId = req.query.id;

        const products=await Products.findOne({_id:productId})

        const category = await Category.find({is_Listed : true})

        const offerData=await Offer.find().populate('category')

        for (let i = 0; i < offerData.length; i++) {

            for (let j = 0; j < products.length; j++) {
                
                const category = await Category.findOne({ name: products[j].category });

                if (category) {

                    if (offerData[i].category.equals(category._id)) {

                        const offerPrice = parseInt(products[j].price/100 * (100 -offerData[i].offer))

                        console.log(offerPrice,products[j].name);
                        
                        products[j].offerPrice = offerPrice; 

                        await products[j].save(); 

                    }
                } else {
                    console.log(`Category not found for product with ID ${products[j]._id}`);
                }
            }
        }

        res.render('productdetails',{categoryData : category,user,productDetails:products})

    } catch (error) {

        console.error(error.message);
    }
}


// sort Product
const sortProduct = async(req,res)=>{
    try {
     
      const { criteria } = req.params;

      console.log('awfsd'+criteria);

      let productDAta

      switch (criteria) {

        case 'priceLow-High':
          productDAta = await Products.find({is_Listed:true}).sort({ price: 1 });
          break;
        case 'priceHigh-Low':
          productDAta = await Products.find({is_Listed:true}).sort({ price: -1 });
          break;
        case 'nameA-Z':
          productDAta = await Products.find({is_Listed:true}).sort({ name: 1 });
          break;
        case 'nameZ-A':
          productDAta = await Products.find({is_Listed:true}).sort({ name: -1 });
          break;
        case 'newArrivals':
          productDAta = await Products.find({is_Listed:true}).sort({ createdAt: -1 });
          break;
        
        
        default:
          res.status(400).json({ error: 'Invalid sorting criteria' });
          return;
      }
     
         res.json({ productDAta });

    } catch (error) {

      console.error(error);
      
    }
  }

  // search product

const searchName = async (req,res)=>{

    const input = req.body.q;

    console.log('ghgh'+input);
    
    if(!input){

      return res.status(400).send('Search Name is Required...!')

    }

    try {

      const productFound = await Products.find({ name : {$regex : input , $options:'i'}})

     
     if(productFound === 0){

      return res.status(200).json({ message : "No product found matching your Search query"})

     }
    
      res.json(productFound)

    } catch (error) {

      console.log(error);

    }
  }


  // filerProducts
const filterProducts = async (req,res)=>{
    try {
      const {categories} = req.body

      console.log('cat'+categories)

      const allproduct=await Products.find({is_Listed:true})

      const productsFound = await Products.find({

        is_Listed:true,category : {

          $in : categories

        }
      })

      console.log('productsFound',productsFound);

      if(productsFound.length === 0){

        res.json(allproduct)

      } else{

        res.json(productsFound)
      }

    } catch (error) {

      console.log(error);

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
    verifyEditProduct,
    sortProduct,
    searchName,
    filterProducts
}