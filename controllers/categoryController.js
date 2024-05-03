const Category=require('../models/category_model');
 
// load category
const loadCategory=async(req,res)=>{
    try {
        
        const categoryData= await Category.find({})
        res.render('category',{category:categoryData})
    } catch (error) {
        console.log(error.message);
    }
}


// add category
const addcategory=async(req,res)=>{
    try {
        console.log('kkoop');
        console.log(req.query.inp);
        if(req.query.inp){

            const catecheck = await Category.findOne({ name: { $regex: new RegExp('^' + req.query.inp + '$', 'i') } });
            
            if (catecheck) {
                
                res.send({ status: true });
                
            } else {
                
                res.send({ status: false });
                
            }
            
        } else if(req.query.name && req.query.radio ){

            const addCategory = new Category({

                name: req.query.name,

                is_Listed: req.query.radio
    
            });
            
            addCategory.save();

            res.send({ true: true });
        }
    } catch (error) {
        console.log(error.message);
    }
}

// edit category
const editcategory=async(req,res)=>{
   
    const id=req.query.id

    const value=req.query.value

    const edited=await Category.findOneAndUpdate({_id:id},{$set:{name:value}})
    
    res.send({set:true})
}

const categoryAction = async (req, res) => {

    try {
      
        const categoryId = req.query.id;
        
        const categoryy = await Category.findOne({ _id: categoryId });

        categoryy.is_Listed = !categoryy.is_Listed;

        categoryy.save();
        
        res.send(true);
   
    } catch (error) {
        
        console.log(error.message);
        
    }
    
};


module.exports={
    loadCategory,
    addcategory,
    editcategory,
    categoryAction
}