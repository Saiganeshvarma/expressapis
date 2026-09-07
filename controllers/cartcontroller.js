// Import Cart model
// This model is used to store cart items in MongoDB.
var Cart = require("../model/cartmodel")

// Import Product model
// We use this to verify whether a product exists before adding it to the cart.
var Product = require("../model/productmodel")


// ======================================
// ADD TO CART
// ======================================

var addToCart = async (req, res) => {

    try {

        // Get productId and quantity from request body.
        var { productId, quantity } = req.body

        // If quantity is not provided, make it 1.
        quantity = quantity || 1

        // Check whether the product exists in the products collection.
        var existingProduct = await Product.findById(productId)

        // If product doesn't exist, stop here.
        if (!existingProduct) {

            return res.status(404).json({
                message: "Product not found"
            })

        }

        // Check whether this user already has the same product in the cart.
        var existingCart = await Cart.findOne({

            user: req.user.userId,   // Current logged-in user

            product: productId        // Selected product

        })

        // If the product already exists in the cart...
        if (existingCart) {

            // Increase the quantity instead of creating another document.
            existingCart.quantity += quantity

            // Save updated quantity.
            await existingCart.save()

            return res.status(200).json({

                message: "Cart updated",

                data: existingCart

            })

        }

        // If product is not already in the cart,
        // create a new cart document.
        var newCart = await Cart.create({

            user: req.user.userId,

            product: productId,

            quantity

        })

        res.status(201).json({

            message: "Added to cart",

            data: newCart

        })

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        })

    }

}


// ======================================
// GET USER CART
// ======================================

var getCart = async (req, res) => {

    try {

        // Get all cart items that belong to the logged-in user.
        var cart = await Cart.find({

            user: req.user.userId

        })

        // Replace product IDs with complete product details.
        .populate("product")

        // Variable to store total cart price.
        var total = 0

        // Loop through every cart item.
        cart.forEach(function(item){

            // price × quantity
            total += item.product.price * item.quantity

        })

        res.status(200).json({

            // Number of different products in the cart.
            totalItems: cart.length,

            // Total amount of the cart.
            totalPrice: total,

            // Complete cart data.
            data: cart

        })

    }

    catch(error){

        res.status(500).json({

            message:error.message

        })

    }

}


// ======================================
// UPDATE CART QUANTITY
// ======================================

var updateCart = async (req, res) => {

    try{

        // Get cart item ID from URL.
        var id = req.params.id

        // Get new quantity from request body.
        var { quantity } = req.body

        // Quantity cannot be zero or negative.
        if(quantity < 1){

            return res.status(400).json({

                message:"Quantity must be at least 1"

            })

        }

        // Find this cart item only if it belongs to the logged-in user.
        var cart = await Cart.findOne({

            _id:id,

            user:req.user.userId

        })

        // If cart item doesn't exist.
        if(!cart){

            return res.status(404).json({

                message:"Cart item not found"

            })

        }

        // Update quantity.
        cart.quantity = quantity

        // Save updated quantity.
        await cart.save()

        res.status(200).json({

            message:"Cart updated",

            data:cart

        })

    }

    catch(error){

        res.status(500).json({

            message:error.message

        })

    }

}


// ======================================
// REMOVE SINGLE CART ITEM
// ======================================

var removeCartItem = async (req,res)=>{

    try{

        // Get cart item ID from URL.
        var id=req.params.id

        // Find cart item only if it belongs to this user.
        var cart=await Cart.findOne({

            _id:id,

            user:req.user.userId

        })

        // If not found.
        if(!cart){

            return res.status(404).json({

                message:"Cart item not found"

            })

        }

        // Delete the cart item.
        await Cart.findByIdAndDelete(id)

        res.status(200).json({

            message:"Item removed"

        })

    }

    catch(error){

        res.status(500).json({

            message:error.message

        })

    }

}


// ======================================
// CLEAR ENTIRE CART
// ======================================

var clearCart=async(req,res)=>{

    try{

        // Delete every cart item that belongs to the logged-in user.
        await Cart.deleteMany({

            user:req.user.userId

        })

        res.status(200).json({

            message:"Cart cleared"

        })

    }

    catch(error){

        res.status(500).json({

            message:error.message

        })

    }

}


// ======================================
// EXPORT CONTROLLERS
// ======================================

module.exports={

    addToCart,

    getCart,

    updateCart,

    removeCartItem,

    clearCart

}