const User=require('../models/user_model')
const bcrypt=require('bcrypt')

// load dashbord
const loadDashbord=async(req,res)=>{
    try {
        res.render('dashbord')
    } catch (error) {
        console.log(error.message);
    }
}

// load login
const loadLogin = async (req, res) => {
    try {
        const msg = req.flash('msg');
        res.render('login', { msg });
    } catch (error) {
        console.log(error.message);
    }
};


// verify admin post method
const verifyAdmin=async(req,res)=>{
    try {
        const {email,pass}=req.body
        const adminData=await User.findOne({email:email,is_admin:true});
        if(adminData){
            const matchpass=await bcrypt.compare(pass,adminData.password)
            if(matchpass){
                req.session.admin=adminData._id
                console.log('kkk');
                res.redirect('/admin/dashbord')
            }else{
                req.flash('msg','password is wrong')
                res.redirect('/admin')
            }
        }else{
            req.flash('msg','your are not admin')
            res.redirect('/admin')
        }
      
    } catch (error) {
        console.log(error.message);
    }
}

// load userlist
const loadUserList=async(req,res)=>{
    try {
        const userData=await User.find({is_admin:false})
        res.render('userlist',{users:userData})
    } catch (error) {
        console.log(error.message);
    }
}

// block and unblock
const loadblock=async(req ,res)=>{
    try {
        console.log('jhjh');
        const blockUserId=req.query.userId;
        console.log(blockUserId);

        await User.findByIdAndUpdate({_id:blockUserId},{$set:{is_blocked:true}})

        const userData=await User.find({is_admin:false});

        // res.render('userlist',{users:userData})
        // res.redirect('userlist')
        res.json({success:true})

    } catch (error) {
        console.log(error.message);
    }
}

// load unblock
const loadunblock=async(req,res)=>{
    try {

        const unblockUserId=req.query.userId
        
        await User.findByIdAndUpdate({_id:unblockUserId},{$set:{is_blocked:false}})

        const userData=await User.find({is_admin:false})

        res.render('userlist',{users:userData})

        res.json({success:true})

    } catch (error) {
        console.log();
    }
}

module.exports={
    loadDashbord,
    loadUserList,
    loadLogin,
    verifyAdmin,
    loadblock,
    loadunblock
}