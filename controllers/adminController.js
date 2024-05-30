const User=require('../models/user_model');

const bcrypt=require('bcrypt');

const Order=require('../models/order_model');

const Products=require('../models/product_model')

const Category=require('../models/category_model')

// load dashbord
const loadDashbord = async (req, res) => {
    try {
        const orderData = await Order.find();

        const bestProducts = await Products.find().sort({ count: -1 }).limit(4)

        const bestCategories = await Category.find().sort({ sales: -1 }).limit(4);

        console.log(bestProducts,'pro');

        const orderAmount = orderData.reduce((acc, order) => {

            return acc + order.orderAmount;

        }, 0);

        console.log(orderAmount,'chiiiiiii');

        let productCount =0;

        for(i=0;i<orderData.length;i++){

            let lg=orderData[i].products

            for(j=0;j<lg.length;j++){

                productCount=productCount+lg[j].quantity

            }
        }
        console.log(productCount,'faaaaa');

        const weekSales = Array(7).fill(0);
        const monthSales = Array(4).fill(0);
        const yearSales = Array(12).fill(0);
        console.log(weekSales,monthSales,yearSales,'ooppppppppppppp');

        orderData.forEach(order => {
            const date = new Date(order.orderDate);
            const day = date.getDay(); // 0-6 (Sunday-Saturday)
            const month = date.getMonth(); // 0-11 (Jan-Dec)
            const week = Math.floor(date.getDate() / 7); // Week of the month
            
            // Calculate total amount per period
            weekSales[day] += order.orderAmount;
            monthSales[week] += order.orderAmount;
            yearSales[month] += order.orderAmount;
        });
        
        res.render('dashbord', { orderData, orderAmount,productCount ,bestProducts,bestCategories,week:weekSales,month:monthSales,year:yearSales});

    } catch (error) {
        console.log(error.message);
    }
}


// load login
const loadLogin = async (req, res) => {
    try {

        const msg = req.flash('msg')

        res.render('login', { msg })

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
        
        const blockUserId=req.query.userId;

        console.log(blockUserId);

        await User.findByIdAndUpdate({_id:blockUserId},{$set:{is_blocked:true}})

        const userData=await User.find({is_admin:false});

        res.json({success:true})

    } catch (error) {
        console.log(error.message);
    }
}

// load unblock
const loadunblock=async(req,res)=>{
    try {

        console.log('unblock');

        const unblockUserId=req.query.userId
        
        await User.findByIdAndUpdate({_id:unblockUserId},{$set:{is_blocked:false}})

        const userData=await User.find({is_admin:false})

        res.render('userlist',{users:userData})

        res.json({success:true})

    } catch (error) {
        
        console.log();
    }
}

// logout
const logout = async ( req , res ) => {
    try {
    
        req.session.admin = undefined

        res.redirect('/admin')
    
    } catch (error) {
        
    }
}

module.exports={
    loadDashbord,
    loadUserList,
    loadLogin,
    verifyAdmin,
    loadblock,
    loadunblock,
    logout
}