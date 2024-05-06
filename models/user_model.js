const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    fullname: {

        type: String,
        
    },

    email: {
        
        type: String,
        required :true

    },

    phone: {
        
        type: String,
     

    },

    password: {
        
        type: String,
        required:true

    },

    is_verified: {
        
        type: Boolean,
        default:false
    },

    is_admin: {
        
        type: Boolean,
        default:false
    },

    datejoined: {
        
        type: Date,
        default:Date.now

    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    coupen:[{
       coupenId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'coupen',
       }
       
        
    }]

},{timestamps:true});

module.exports = mongoose.model("userData", userSchema);