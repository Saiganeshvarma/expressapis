var crypto = require("crypto")

var Razorpay = require("../config/razorpay")

var Cart = require("../model/cartmodel")

var Payment = require("../model/paymentmodel")


var checkout = async (req,res)=>{

    try{

        var cart = await Cart.find({

            user:req.user.userId

        }).populate("product")

        if(cart.length===0){

            return res.status(400).json({

                message:"Cart is empty"

            })

        }

        var total=0

        cart.forEach(function(item){

            total += item.product.price * item.quantity

        })

        var options={

            amount:total*100,

            currency:"INR",

            receipt:"receipt_"+Date.now()

        }

        var order = await Razorpay.orders.create(options)

        await Payment.create({

            user:req.user.userId,

            orderId:order.id,

            amount:total,

            currency:"INR"

        })

        res.status(201).json({

            message:"Order created",

            key:process.env.RAZORPAY_KEY_ID,

            order

        })

    }

    catch(error){

        res.status(500).json({

            message:error.message

        })

    }

}



var verifyPayment = async (req,res)=>{

    try{

        var{

            razorpay_order_id,

            razorpay_payment_id,

            razorpay_signature

        }=req.body

        var generatedSignature = crypto

            .createHmac(

                "sha256",

                process.env.RAZORPAY_KEY_SECRET

            )

            .update(

                razorpay_order_id+"|"+razorpay_payment_id

            )

            .digest("hex")

        if(generatedSignature!==razorpay_signature){

            return res.status(400).json({

                message:"Invalid payment"

            })

        }

        var payment=await Payment.findOne({

            orderId:razorpay_order_id

        })

        payment.paymentId=razorpay_payment_id

        payment.signature=razorpay_signature

        payment.status="paid"

        await payment.save()

        await Cart.deleteMany({

            user:req.user.userId

        })

        res.status(200).json({

            message:"Payment verified",

            payment

        })

    }

    catch(error){

        res.status(500).json({

            message:error.message

        })

    }

}



var getPayment = async(req,res)=>{

    try{

        var payment = await Payment.findById(req.params.id)

        if(!payment){

            return res.status(404).json({

                message:"Payment not found"

            })

        }

        res.status(200).json(payment)

    }

    catch(error){

        res.status(500).json({

            message:error.message

        })

    }

}


module.exports={

    checkout,

    verifyPayment,

    getPayment

}