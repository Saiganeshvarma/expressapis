var mongoose = require("mongoose")

var paymentSchema = new mongoose.Schema({

    user:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },

    orderId:String,

    paymentId:String,

    signature:String,

    amount:Number,

    currency:{

        type:String,

        default:"INR"

    },

    status:{

        type:String,

        enum:["created","paid","failed"],

        default:"created"

    }

},{timestamps:true})

module.exports = mongoose.model("Payment",paymentSchema)