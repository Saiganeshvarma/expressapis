var express = require("express")

var {
    register,
    login
} = require("../controllers/authcontrollers")


var router = express.Router()


// ======================================
// REGISTER
// ======================================

router.post(
    "/register",
    register
)


// ======================================
// LOGIN
// ======================================

router.post(
    "/login",
    login
)


module.exports = router