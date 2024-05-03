const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    fullname: {

        type: String,
        required:true
    },

    email: {
        
        type: String,
        required :true

    },

    phone: {
        
        type: String,
        required:true

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
    }

},{timestamps:true});

module.exports = mongoose.model("userData", userSchema);