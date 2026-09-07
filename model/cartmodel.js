// Import mongoose.
// Mongoose is used to create schemas and interact with MongoDB.
var mongoose = require("mongoose")


// ======================================
// CART SCHEMA
// ======================================

// Create a new schema for the Cart collection.
var cartSchema = new mongoose.Schema({

    // ----------------------------------
    // USER FIELD
    // ----------------------------------

    // Stores the ID of the logged-in user.
    // Instead of storing the entire user object,
    // MongoDB stores only the user's ObjectId.
    user: {

        // ObjectId creates a relationship with another collection.
        type: mongoose.Schema.Types.ObjectId,

        // This links the user field to the User model.
        // We can later use populate("user") to get user details.
        ref: "User",

        // Every cart item must belong to a user.
        required: true

    },


    // ----------------------------------
    // PRODUCT FIELD
    // ----------------------------------

    // Stores the ID of the product added to the cart.
    product: {

        // ObjectId references the Product collection.
        type: mongoose.Schema.Types.ObjectId,

        // Links this field to the Product model.
        // populate("product") replaces the ID with product details.
        ref: "Product",

        // Every cart item must have a product.
        required: true

    },


    // ----------------------------------
    // QUANTITY FIELD
    // ----------------------------------

    // Stores how many units of the product the user wants.
    quantity: {

        // Quantity must be a number.
        type: Number,

        // If the user doesn't send a quantity,
        // it automatically becomes 1.
        default: 1

    }

// Second object contains schema options.
}, {

    // Automatically adds two fields:
    // createdAt -> When the cart item was created.
    // updatedAt -> When the cart item was last updated.
    timestamps: true

})


// ======================================
// EXPORT MODEL
// ======================================

// Create a MongoDB collection named "Cart"
// and export it so controllers can use it.
module.exports = mongoose.model("Cart", cartSchema)