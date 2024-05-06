const Offer = require("../models/offer_modal");

const Catogory = require("../models/category_model");

const Product=require('../models/product_model');

const loadOffer = async (req, res) => {
  try {

    const category = await Catogory.find({ is_Listed: true });

    const offer = await Offer.find();

    res.render("offer", { category, offer });

  } catch (error) {

    console.log(error.message);
    
  }
};

  // addOffer
  const addOffer = async (req, res) => {
    try {

      console.log("offer");

      const { offname, category, offer } = req.body;

      await Offer.create({

        name: offname,
        category,
        offer,

      });

      res.redirect("/admin/offer");

    } catch (error) {

      console.log(error.message);

    }
    
  };


  // remove offer
  const offerRemove = async (req, res) => {
    
    try {

        const offerId = req.query.id
        
        const removed = await Offer.findOneAndDelete({ _id: offerId });

        const cateId = removed.category._id

        if (removed) {
            
            const r = await Product.updateMany({ category: cateId }, { $set: { discount: 0, discount_price: 0 } });

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
