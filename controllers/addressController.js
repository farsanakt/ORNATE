
const Address=require('../models/address_model');

const Category=require('../models/category_model');

const User=require('../models/user_model')

const loadAddress=async(req,res)=>{
    try {
  

        const user=req.session.user

        const msgg=req.flash('msg')

        const categoryData=await Category.find({is_Listed:true})

        const userIdd=req.session.user

        const userData=await User.findOne({_id:user})
 
        const address=await Address.find({userId:userIdd})

        res.render('profileaddress',{categoryData,address,msgg,userData,user})
    } catch (error) {
        console.log(error.message);
    }
}


// profile add address
const verifyProfileAddAddess = async(req , res)=>{

    try {

        const user = req.query.id;

        console.log('helllo')

        const addressData = await Address.findOne({userId : user , addresss : {$elemMatch : {address : req.body.addressData.address}}});

        if(!addressData){

            const verifyData = await Address.findOneAndUpdate({userId : user} , {$addToSet : {addresss : {

                name : req.body.addressData.name,
                phone : req.body.addressData.phone,
                loacality : req.body.addressData.locality,
                city : req.body.addressData.city,
                states : req.body.addressData.state,
                pincode : req.body.addressData.pincode,
                address : req.body.addressData.addresss,
            
            }}} , {upsert : true , new : true})
            
            res.send({success : true})

        } else {

            res.send({fail : true})

        }
        
        
    } catch (error) {

        console.log(error.message);
        
    }

};

//  delete Address :-

const deleteaAdderss = async(req , res)=>{

    const userIdd = req.query.id

    console.log(userIdd);

    const addId = req.query.addid

    const remove = await Address.findOneAndUpdate({userId : userIdd},{$pull:{addresss:{_id:addId}}});

    console.log(remove);

    if(remove){

        res.send(true)

    }

}

// edit adress
const editprofileaddress=async(req,res)=>{
    try {
        const { edit } = req.body;
        
        const editData = await Address.findOne({ 'addresss._id': edit }, { 'addresss.$': 1 });
       
        res.json({ editData });

    } catch (error) {

        console.log(error.message);
    }
}


//  Verify Edit Address (Post Method) :-

const verifyEditAddress = async (req, res) => {
    
    try {

        const user_Id = req.session.user;
        
        const { name, phone, locality, pincode, address, city, state, id } = req.body;
       
        const editAddress = await Address.findOneAndUpdate({ userId: user_Id, 'addresss._id': id }, { $set: { 'addresss.$.name': name, 'addresss.$.phone': phone, 'addresss.$.locality': locality, 'addresss.$.pincode': pincode, 'addresss.$.city': city, 'addresss.$.state': state, 'addresss.$.address': address } });

        if (editAddress) {
          
            req.flash('flash', 'Address Edited');
            res.redirect('/profileaddress');

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

};




module.exports={
    loadAddress,
    verifyProfileAddAddess,
    deleteaAdderss,
    editprofileaddress,
   verifyEditAddress
    
}