var express=require("express")

var authMiddleware=require("../middleware/authmiddleware")

var{

    checkout,

    verifyPayment,

    getPayment

}=require("../controllers/paymentcontroller")

var router=express.Router()

router.post("/checkout",authMiddleware,checkout)

router.post("/payment/verify",authMiddleware,verifyPayment)

router.get("/payment/:id",authMiddleware,getPayment)

module.exports=router