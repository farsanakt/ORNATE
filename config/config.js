const mongoose=require('mongoose');
require('dotenv').config()

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("db connected");
    }).catch(()=>{
        console.log('error in mongodb');
    })
}