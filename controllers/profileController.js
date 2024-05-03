const User=require('../models/user_model');

const Category=require('../models/category_model')



//  securely hash passwords :-
const bcrypt = require('bcrypt');

const securePassword = async (password) => {
    
    try {

        const passwordHash = await bcrypt.hash(password , 10);
        return passwordHash;
        
    } catch (error) {

        console.log(error.message);
        
    }

};

const loadProfile=async(req,res)=>{
    try {
        const category = await Category.find({is_Listed : true})
        const msgg=req.flash('msg')
        const userId=req.session.user
        console.log(userId);
        const userData=await User.findById({_id:userId})
        res.render('profile',{categoryData:category,userData,msgg})
    } catch (error) {
        console.log(error.message);
    }
}

// edit Profile
const editProfile=async(req,res)=>{
    try {
        await User.findByIdAndUpdate({_id:req.query.userId},{$set:{fullname:req.body.name,phone:req.body.phone}});
        res.redirect('profile')
    } catch (error) {
       console.log( error.message);
    }
}

const changePassword = async (req, res) => {
    try {
        const oldPass = req.body.old;

        const exitPass = req.session.userData.password;
        const newPass = await securePassword(req.body.newPass);
        
        const verifyPass = await bcrypt.compare(oldPass,exitPass);
        
        if (verifyPass) {
            await User.findByIdAndUpdate({ _id: req.query.userId }, { $set: { password: newPass } });
            res.redirect('/profile');
        } else {
            req.flash('msgg', "Old password is wrong");
            res.redirect('/profile');
        }
    } catch (error) {
        console.log(error.message);
    }
}



module.exports={
    loadProfile,
    editProfile,
    changePassword
}