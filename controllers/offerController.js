const Offer = require("../models/offer_modal");

const Catogory = require("../models/category_model");

const Product=require('../models/product_model');

const loadOffer = async (req, res) => {
  try {

    const category = await Catogory.find({ is_Listed: true });

    const offer = await Offer.find();

    const msg=req.flash('msg')

    res.render("offer", { category, offer,msg });

  } catch (error) {

    console.log(error.message);
    
  }
};

  // addOffer
  const addOffer = async (req, res) => {
    try {

      console.log("offer");

      const { offname, category, offer } = req.body;

      const existingOffr=await Offer.findOne({category:category})
      console.log(existingOffr);
      if(existingOffr){

        req.flash('msg','this category offer is already existing')
        res.redirect('/admin/offer')

      }else{
        const newOffr=new Offer({

          name: offname,
          category,
          offer,
  
  
        })
  
        
        await newOffr.save();
  
        const catName=await Catogory.findOne({_id:category});
  
        const produ=await Product.find({category:catName.name})
  
        for(const key of produ){
  
          const offerPrice=parseInt(key.price/100*(100-offer))
  
          await Product.findOneAndUpdate({_id:key._id},{$set:{offerPrice}})
          
        }
  
        res.redirect("/admin/offer");
        
      }

    

    } catch (error) {

      console.log(error.message);

    }
    
  };


  // remove offer
  const offerRemove = async (req, res) => {
    
    try {

        const offerId = req.query.id
        
        const removed = await Offer.findOneAndDelete({ _id: offerId });

        const cateId = removed.category
        const catName=await Catogory.findOne({_id:cateId});
        if (removed) {
            console.log('skskskskks');
            const r = await Product.updateMany({ category: catName.name }, { $set: {offerPrice:null } });

            res.send({ succ: true })

        } else {

            res.send({ fail: true })

        }

    } catch (error) {

        console.log(error.message);
        
    }

};


module.exports = {
  loadOffer,
  addOffer,
  offerRemove
};
