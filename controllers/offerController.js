const Offer=require('../models/offer_modal');

const Catogory=require('../models/category_model');

const loadOffer=async(req,res)=>{
    try {
        const category=await Catogory.find({is_Listed:true})
        const offer=await Offer.find()
        res.render('offer',{category,offer})
    } catch (error) {
        console.log(error.message);
    }
}

// addOffer
const addOffer=async(req,res)=>{
    try {
        console.log('kkkkkokoopp');
        const {offname,category,offer}=req.body
        console.log(offname,category,offer);
        res.redirect('/offer')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    loadOffer,
    addOffer
}