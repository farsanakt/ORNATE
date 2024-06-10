const mongoose = require("mongoose");

const Order = mongoose.Schema({

    userId: {
      
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userData',
        required: true,
    
    },

    orderAmount: {
      
        type: Number,
        required: true,
    
    },

    payment: {
      
        type: String,
        required: true,
    
    },

    orderDate: {
      
        type: Date,
        required: true,
        default: Date.now,
    
    },

   

    deliveryAddress: {
      
        name: { type: String, required: true },
        phone: { type: Number, required: true },
        city: { type: String, required: true },
        states: { type: String, required: true },
        pincode: { type: Number, required: true },
        address: { type: String, required: true },
        loacality: { type: String, required: true },
    
    },

    products: [{
        
        productId: {
          
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        
        },

        quantity: {
        
            type: Number,
            default: 1,
            required: true
        
        },
      
        price: {
                
            type: Number,
            required: true,
            
        },
          
        orderProStatus: {
                
            type: String,
            required: true,
            enum: ['pending', 'shipped', 'delivered', 'canceled','returned','requested to return'],
            default: 'pending',

        },
        reason:{
            type:String,
            default:null
        },
    
    }],
    apporved:{
        type:Number,
        default:0
    },
    discount:{
        type:Number,
        default:0
    },
    paymentStatus:{
        type:String,
        default:'success'
    },
    orderId:{
        type:String
    
    }


}); 

module.exports = mongoose.model("order", Order);