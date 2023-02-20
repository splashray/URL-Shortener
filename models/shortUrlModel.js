const mongoose  = require("mongoose")
const shortId = require("shortid")

const shortUrlSchema = new mongoose.Schema({
    userId: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User',
         required: true 
    },
    full:{
        type:String,
        required:true
    },
    short:{
        type:String, 
        required:true,
        default: shortId.generate
    },
    clicks:{
        type:Number, 
        require:true,
        default: 0
    },
   
}) 

module.exports = mongoose.model("ShortUrl", shortUrlSchema) 