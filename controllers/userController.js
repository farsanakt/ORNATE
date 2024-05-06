 const User=require('../models/user_model');

 const Otp=require('../models/otp_model');

 const nodemailer = require('nodemailer');

 const Category=require('../models/category_model');

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

//  Function= generateotp
   const generateotp=()=>{
    const digits = '0123456789';

    let OTP = '';

    for (let i = 0; i < 4; i++) {

        OTP += digits[Math.floor(Math.random() * 10)];
    };

    return OTP;
}

// function=sending mail
const sendmail = async(fullname,email,sendotp,res) =>{
    
    try {
        
        const transporter = nodemailer.createTransport({

            service:'gmail',
            auth:{
                
                user: process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASSWORD

            }
        });
        

        // compose email 
        const mailOption = {
            from :'ffarsanakt@gmail.com' ,
            to:email,
            subject:'For Otp Verification',
            html :`<h3>Hello ${fullname},Welcome To ORNATE</h3> <br> <h4>Enter : ${sendotp} on the OTP Box to register</h4>`
        }

        //send mail
        transporter.sendMail(mailOption,function(error,info){

            if(error){
                console.log('Erro sending mail :- ',error.message);
            }else{
                console.log('Email has been sended :- ',info.response);
            }
        });

    

        
} catch(error){
    console.log(error.message);
}
 }

// load home
const loadhome=async(req,res)=>{

    try {
        const user=req.session.user

        const category = await Category.find({is_Listed : true})

        res.render('home',{categoryData : category,user})

    } catch (error) {

        console.log(error.message);
    }
}

// load signup
const loadSignUp=async(req,res)=>{
    try {

        const category = await Category.find({is_Listed : true})

        const msg=req.flash('msg')

        res.render('signUp',{categoryData:category,msg:msg})

    } catch (error) {

        console.log(error.message);
    }
}

// verify signup
const verifySignUp=async(req,res)=>{

    const {fullname,email,phone,password,confirmpassword}=req.body

     const exitmail=await User.findOne({email:req.body.email})
    
    try {
           if(exitmail){

            req.flash('msg','this email is already exited')

            res.redirect('/signup')

           }else if(password!==confirmpassword){

            req.flash('msg', 'Password and confirm password do not match');

            return res.redirect('/signup');

           }else{
            
            req.session.userData={fullname,email,phone,password,confirmpassword}

            const otp=generateotp();

            req.session.otp=otp

            console.log('otp='+otp);

              // sending otp to email

               await sendmail(fullname,email,otp)

               // otp schema adding 
               const userOTP = new Otp({
                   email:email,
                   otp: otp,         
               });

           await userOTP.save()

               console.log("this is otpdoc",userOTP)
           
               res.redirect('/loadotp');

           }
        
    } catch (error) {
        console.log(error.message);
    }
}

   
// load otp (get method)
const loadotp=async(req,res)=>{

    const category = await Category.find({is_Listed : true})
        try {

           if(req.session.otp || req.session.forget){
              
               req.session.forgot=undefined

               const msg=req.flash('msg')

               const forget =req.session.forget || false

               res.render('otp',{categoryData:category,msg,forget})

           }else{
             
               res.redirect('/login')
           }
        } catch (error) {

           console.log(error.message);
        }
   }
   
// verify otp(post method)
const verifyotp = async (req, res) => {

    try {

        console.log(req.session.userData.email);

        const { inp1, inp2, inp3, inp4, email } = req.body;

        const bodyotp = inp1 + inp2 + inp3 + inp4;

        const otp = await Otp.findOne({ email: req.session.userData.email });
        
        const hashedpassword = await securePassword(req.session.userData.password);
       
      
         if(otp.otp == bodyotp) {

            const user = new User({
                fullname: req.session.userData.fullname, 
                email: req.session.userData.email,
                phone: req.session.userData.phone,
                password: hashedpassword
            });

            const data = await user.save();

            req.session.User = data._id;

            delete req.session.otp;

            console.log(user);

            return res.redirect('/login');

        } else {

            req.flash('msg', 'Invalid OTP');

            return res.redirect('/loadotp');

        }
    } catch (error) {

        console.log(error.message);
    }
};

// load login
const loadLoginPage=async(req,res)=>{
    try {

        const msg=req.flash('msg')

        const category = await Category.find({is_Listed : true})

        res.render('login',{categoryData:category,msg})

    } catch (error) {

        console.log(error.message)

    }
}

// verify user
const verifyUser=async(req,res)=>{
    
    const verifymail=req.body.email

    const passData=req.body.password
    
    const data=await User.findOne({email:verifymail})

    try {

        if(data){

            const verifyPass=await bcrypt.compare(passData,data.password);

            if(data.is_blocked){

                req.flash('msg','your are blocked')

                res.redirect('/login')

            }

             else if(verifyPass){

                console.log('3');

                req.session.userData=data

                req.session.user=data._id

                console.log('verified successully')

                res.redirect('/')

            }else{

                console.log('1dc');

                req.flash('msg','wrong password')

                res.redirect('/login')
            }

        }else{

            console.log('1111');

            req.flash('msg','email not existing')

            res.redirect('/login')
        }
        
    } catch (error) {

        console.log(error.message);
    }
}

// load about us
const loadAboutUs=async(req,res)=>{
    try {
        const user=req.session.user

        const category = await Category.find({is_Listed : true})

        res.render('aboutUs',{user,categoryData:category})

    } catch (error) {

        console.log(error.message);
    }
}

// load contactus
const loadContactUs=async(req,res)=>{

    try {
        const category = await Category.find({is_Listed : true})

        const user=req.session.user
        
        res.render('contactUs',{user,categoryData:category})

    } catch (error) {

        console.log(error.message);
    }
}

// logout
const logout=async(req,res)=>{
    try {

        req.session.destroy()

        res.redirect('/')
        
    } catch (error) {
        
    }
}

// loadforgotpassword
const loadForGotpassword=async(req,res)=>{
    try {

        const category=await Category.find({is_Listed:true})

        const msg=req.flash('msg')

        res.render('forgotpassword',{categoryData:category,msg})

    } catch (error) {

        console.log(error.message);
    }
}

// post method(forgotpassword)
const forgotpasswordOtp=async(req ,res)=>{

    console.log('ethiiiiiiiiii');
    try {

        const getemail=req.body.email

        console.log(getemail);

        const finduser=await User.findOne({email:getemail})

        if(finduser){

            req.session.forgot=true;

            const otp= generateotp();

            const userOTP = new Otp({
                email:getemail,
                otp: otp,         
            });

           await userOTP.save()
            await sendmail(finduser.fullName,getemail,otp)
            req.session.email=getemail
            console.log(otp);
            req.session.forget=true
            res.redirect('/loadotp')

        }else{
            
            req.flash('msg','email not exit')

            res.redirect('/forgotpassword')
        }
    } catch (error) {

        console.log(error.message);
    }
}

// forgotpass otp verifiy
const verifiyPassOtp=async(req ,res)=>{
    try {

        const {inp1,inp2,inp3,inp4}=req.body;

        const passotp=inp1+inp2+inp3+inp4;

        const checkotp=await Otp.findOne({email:req.session.email})

        console.log(checkotp);

        if(checkotp?.otp==passotp){

            res.redirect(`/newpassword?email=${req.session.email}`)

        }else{
            
            req.flash('msg','otp is wrong')

            res.redirect('/loadotp')
        }
        
    } catch (error) {

        console.log(error.message);
    }
}

// load newpassword
const loadnewpassword=async(req,res)=>{
    try {

        const category = await Category.find({is_Listed : true})

        const msg=req.flash('msg');

        const sessEmail = req.session.email

        res.render('newpassword',{categoryData:category , sessEmail})

    } catch (error) {

        console.log(error.message);
    }
}

// update password
const updatepassword=async(req,res)=>{

    try {
        
        const pass=req.body.password;

        const newpass=req.body.re_password

        const queryemail=req.body.email;
        
        if(pass==newpass){
            
            const hashedpassword = await securePassword(newpass);

            const update = await User.findOneAndUpdate({email :queryemail},{$set:{password : hashedpassword}});

            console.log(update);

            res.redirect('/login')

        }else{

            req.flash('msg','otp is wrong')

            res.redirect('/newpassword')

        }

    
    } catch (error) {

        console.log(error.message);

    }

};

module.exports={
    loadhome,
    loadSignUp,
    verifySignUp,
    verifyotp,
    loadotp,
    loadLoginPage,
    verifyUser,
    loadAboutUs,
    loadContactUs,
    logout,
    loadForGotpassword,
    forgotpasswordOtp,
    loadnewpassword,
    updatepassword,
    verifiyPassOtp

}