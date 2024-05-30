const mongoose = require('mongoose');
const productSchema=new mongoose.Schema({

    name:{type:String,required:true},

    description:{type:String , required:true},

    price:{type:Number, required:true},

    category:{type: String,required:true},

    createAt:{type:Date},

    status:{type:Boolean,default:true},

    is_Listed: {type: Boolean,  default:false},

    stock:{type:Number, default:1},
    
    images:{type:Array,required:true},

    offerPrice:{type:Number, default:null},

    count:{type:Number,default:0}

});

module.exports=mongoose.model("product",productSchema);