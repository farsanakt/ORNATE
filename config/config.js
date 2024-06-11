const mongoose=require('mongoose');
require('dotenv').config()

exports.connect=async ()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URL)
  }catch(err){
    console.log(err.message,'errr mongodb')
  }
    
}