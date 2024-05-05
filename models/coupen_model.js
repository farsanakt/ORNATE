const mongoose = require('mongoose');

const coupenSchema = mongoose.Schema({

    name: {
        
        type: String,
        required: true

    },

    discount: {
        
        type: Number,
        required: true

    },

 

    above: {
        
        type: Number,
        required: true

    },
    couponId:{
        type:String,
        required:true
    },
    status: {
        
        type: Boolean,
        default: true

    }

    

});

module.exports = mongoose.model('coupen', coupenSchema);