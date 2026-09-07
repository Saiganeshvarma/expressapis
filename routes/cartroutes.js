var express=require("express")

var authMiddleware=require("../middleware/authmiddleware")

var{

    addToCart,

    getCart,

    updateCart,

    removeCartItem,

    clearCart

}=require("../controllers/cartcontroller")

var router=express.Router()

router.post("/cart",authMiddleware,addToCart)

router.get("/cart",authMiddleware,getCart)

router.put("/cart/:id",authMiddleware,updateCart)

router.delete("/cart/:id",authMiddleware,removeCartItem)

router.delete("/cart",authMiddleware,clearCart)

module.exports=router