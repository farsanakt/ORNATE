const User=require('../models/user_model');


const blockeduser=async(req, res,next)=>{
 
    try {
    const user=await User.findOne({_id:req.session.user})
        if(!user.is_blocked){
            next()
        }else{
           req.session.destroy();
           res.redirect('/')
        }
        
    } catch (error) {
        console.log(error.message);
    }

}

const userexist=async(req,res,next)=>{
    try {
        if(!req.session.user){
            next()
        }else{
            res.redirect('/')
        }
    } catch (error) {
        
    }
}


module.exports={
    blockeduser,
    userexist
}