

const adminexist=(req ,res,next)=>{
   
        if(req.session.admin){
            res.redirect('/admin/dashbord')
        }else{
            next();
        }
    }


const adminnotexist=(req,res,next)=>{
    if(!req.session.admin){
        res.redirect('/admin')
    }else{
        next()
    }
}


module.exports = {
    adminexist,
    adminnotexist,
}