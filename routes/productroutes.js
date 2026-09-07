var express = require("express")

var {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productcontroller")

var authMiddleware =
    require("../middleware/authmiddleware")

var upload =
    require("../middleware/uploadimage")


var router = express.Router()


// ======================================
// CREATE PRODUCT
// ======================================

router.post(
    "/create",
    authMiddleware,
    upload.single("image"),
    createProduct
)


// ======================================
// GET ALL PRODUCTS
// ======================================

router.get(
    "/products",
    authMiddleware,
    getAllProducts
)


// ======================================
// GET SINGLE PRODUCT
// ======================================

router.get(
    "/products/:id",
    authMiddleware,
    getSingleProduct
)


// ======================================
// UPDATE PRODUCT
// ======================================

router.put(
    "/update/:id",
    authMiddleware,
    upload.single("image"),
    updateProduct
)


// ======================================
// DELETE PRODUCT
// ======================================

router.delete(
    "/delete/:id",
    authMiddleware,
    deleteProduct
)


// ======================================
// EXPORT ROUTER
// ======================================

module.exports = router