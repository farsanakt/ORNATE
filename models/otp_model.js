const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true
    },
    otp:{
        type:Number,
        required:true
    }

},
{
    timestamps:true
}

    );

    otpSchema.index({ createdAt:1},{expireAfterSeconds:120})

module.exports = mongoose.model('Otp', otpSchema);