const mongoose=require('mongoose');

const addressSchema=new mongoose.Schema({

    userId :{type: mongoose.Schema.Types.ObjectId,ref:'userData',require:true},

    addresss:[{
        name:{ type: String,required:true},
        phone:{ type: Number,required:true},
        city:{type: String,required:true},
        states:{type:String,required:true},
        pincode:{type:String,required:true},
        address:{type:String,required:true},
       loacality :{type:String,required:true},
        status:{type:Boolean,required:true,default:false},
    }],
});

module.exports=mongoose.model('address',addressSchema);