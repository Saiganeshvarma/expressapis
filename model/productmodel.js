var mongoose = require("mongoose")


var productSchema = new mongoose.Schema({

    // ======================================
    // TITLE
    // ======================================

    title: {

        type: String,

        required: true,

        trim: true

    },


    // ======================================
    // DESCRIPTION
    // ======================================

    description: {

        type: String,

        required: true,

        trim: true

    },


    // ======================================
    // PRICE
    // ======================================

    price: {

        type: Number,

        required: true,

        min: 0

    },


    // ======================================
    // CATEGORY
    // ======================================

    category: {

        type: String,

        required: true,

        trim: true

    },


    // ======================================
    // IMAGE
    // ======================================

    image: {

        url: {

            type: String,
            default : ""

        },

        publicId: {

            type: String,
            default : ""

        }

    },


    // ======================================
    // CREATED AT
    // ======================================

    createdAt: {

        type: Date,

        default: Date.now

    }

})


// ======================================
// EXPORT MODEL
// ======================================

module.exports =
    mongoose.model(
        "Product",
        productSchema
    )