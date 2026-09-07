var mongoose = require("mongoose")


var userSchema = new mongoose.Schema({

    // ======================================
    // USERNAME
    // ======================================

    username: {

        type: String,

        required: true,

        unique: true,

        trim: true

    },


    // ======================================
    // EMAIL
    // ======================================

    email: {

        type: String,

        required: true,

        unique: true,

        trim: true,

        lowercase: true

    },


    // ======================================
    // PASSWORD
    // ======================================

    password: {

        type: String,

        required: true

    },


    // ======================================
    // ROLE
    // ======================================

    role: {

        type: String,

        enum: [
            "user",
            "admin"
        ],

        default: "user"

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
        "User",
        userSchema
    )