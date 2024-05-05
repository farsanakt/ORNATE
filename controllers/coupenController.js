const Coupen=require('../models/coupen_model');

const Category=require('../models/category_model');

const User=require('../models/user_model');

// ****** ADMIN SIDE *****



// load coupen
const loadCoupen=async(req,res)=>{
    try {
 
        const coupenData=await Coupen.find()
        res.render('coupen',{coupenData})
    } catch (error) {
        console.log(error.message);
    }
}

const addCoupen=async(req,res)=>{
    try {
        const {coupon,above,discount,couponid}=req.body

        const newId = generateCoupenId()

        const coupenCreating=new Coupen({
            name:coupon,
            discount:discount,
            above:above,
            couponId:couponid
        })

        if(coupenCreating){

            coupenCreating.save()
           
            .then(savedCoupen => {

                
                res.redirect("/admin/coupen");
  
              })
              .catch(error => {
  
                console.error('Error saving coupen:', error);
  
              });

        }
        
    } catch (error) {

        console.log(error.message);

    }
}

//  generateCoupenId :-

const generateCoupenId = () => {

    const look = '123456789ABCDEFG'
    let ID = ''
    
    for (let i = 0; i < 6; i++) {

        ID += look[Math.floor(Math.random() * 10)];

    };

    return ID

}

// changing coupen status
const changeCouponStatus = async (req, res) => {
    try {

        const couponId = req.query.id;

        const coupon = await Coupen.findById(couponId);
         
        coupon.status = !coupon.status;
        
        await coupon.save();

    } catch (error) {

        console.log(error.message);
       
    }
}

// removing Coupen
const removeCoupen=async(req,res)=>{
    try {
        const coupenId=req.query.id
        const coupenremove=await Coupen.deleteOne({_id:coupenId})
        if(coupenremove){
            res.send({succ:true})
        }
    } catch (error) {
        console.log(error.message);
    }
}

// ****** USER *****

const loadCoupens=async(req,res)=>{
    try {

        console.log('ethiiiiiiii')

        const category=await Category.find({is_Listed:true})

        const userIdd=req.session.user

        const user=req.session.user

        const userData=await User.findById({_id:userIdd}).populate('coupen.coupenId')

        console.log(userData,'1');

        res.render('userCoupen',{categoryData:category,userData,user})

    } catch (error) {

        console.log(error.message);

    }
}



module.exports={
    loadCoupen,
    addCoupen,
    changeCouponStatus,
    removeCoupen,
    loadCoupens
}