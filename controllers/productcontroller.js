var product = require("../model/productmodel")
var cloudinary = require("../config/cloudinary")
var { uploadToCloudinary } = require("../helper/cloudinaryHelper")

// ======================================
// CREATE PRODUCT
// ======================================

var createProduct = async (req, res) => {

    try {

        var { title, description, price, category } = req.body

        // Validate required fields
        if (!title || !description || price === undefined || !category) {

            return res.status(400).json({
                message: "Title, description, price and category are required"
            })

        }

        var image = {
            url: "",
            publicId: ""
        }

        // Upload image only if provided
        if (req.file) {

            var uploadedImage = await uploadToCloudinary(req.file.path)

            image = {
                url: uploadedImage.url,
                publicId: uploadedImage.publicId
            }

        }

        var newProduct = await product.create({

            title,
            description,
            price,
            category,
            image

        })

        return res.status(201).json({

            message: "Product created",
            data: newProduct

        })

    } catch (error) {

        console.log("Create product error:", error)

        return res.status(500).json({

            message: "Server error",
            error: error.message

        })

    }

}

// ======================================
// GET ALL PRODUCTS
// ======================================

var getAllProducts = async (req, res) => {

    try {

        var {
            page = 1,
            limit = 10,
            search,
            category,
            minPrice,
            maxPrice
        } = req.query

        page = Number(page)
        limit = Number(limit)

        var query = {}

        if (search) {
            query.title = { $regex: search, $options: "i" }
        }

        if (category) {
            query.category = category
        }

        if (minPrice || maxPrice) {

            query.price = {}

            if (minPrice) {
                query.price.$gte = Number(minPrice)
            }

            if (maxPrice) {
                query.price.$lte = Number(maxPrice)
            }

        }

        var skip = (page - 1) * limit


        var totalProducts = await product.countDocuments(query)

        var allProducts = await product.find(query).skip(skip).limit(limit)

        return res.status(200).json({

            count: totalProducts,
            data: allProducts

        })

    } catch (error) {

        console.log("Get all products error:", error)

        return res.status(500).json({

            message: "Server error",
            error: error.message

        })

    }

}

// ======================================
// GET SINGLE PRODUCT
// ======================================

var getSingleProduct = async (req, res) => {

    try {

        var id = req.params.id

        var singleProduct = await product.findById(id)

        if (!singleProduct) {

            return res.status(404).json({
                message: "Product not found"
            })

        }

        return res.status(200).json({
            data: singleProduct
        })

    } catch (error) {

        console.log("Get single product error:", error)

        return res.status(500).json({

            message: "Server error",
            error: error.message

        })

    }

}

// ======================================
// UPDATE PRODUCT
// ======================================

var updateProduct = async (req, res) => {

    try {

        var id = req.params.id

        var existingProduct = await product.findById(id)

        if (!existingProduct) {

            return res.status(404).json({
                message: "Product not found"
            })

        }

        var { title, description, price, category } = req.body

        if (title !== undefined) existingProduct.title = title
        if (description !== undefined) existingProduct.description = description
        if (price !== undefined) existingProduct.price = price
        if (category !== undefined) existingProduct.category = category

        // Update image only if new image is uploaded
        if (req.file) {

            if (existingProduct.image && existingProduct.image.publicId) {

                await cloudinary.uploader.destroy(existingProduct.image.publicId)

            }

            var uploadedImage = await uploadToCloudinary(req.file.path)

            existingProduct.image = {

                url: uploadedImage.url,
                publicId: uploadedImage.publicId

            }

        }

        var updatedProduct = await existingProduct.save()

        return res.status(200).json({

            message: "Product updated",
            data: updatedProduct

        })

    } catch (error) {

        console.log("Update product error:", error)

        return res.status(500).json({

            message: "Server error",
            error: error.message

        })

    }

}

// ======================================
// DELETE PRODUCT
// ======================================

var deleteProduct = async (req, res) => {

    try {

        var id = req.params.id

        var deletedProduct = await product.findById(id)

        if (!deletedProduct) {

            return res.status(404).json({
                message: "Product not found"
            })

        }

        if (deletedProduct.image && deletedProduct.image.publicId) {

            await cloudinary.uploader.destroy(deletedProduct.image.publicId)

        }

        await product.findByIdAndDelete(id)

        return res.status(200).json({

            message: "Product deleted",
            data: deletedProduct

        })

    } catch (error) {

        console.log("Delete product error:", error)

        return res.status(500).json({

            message: "Server error",
            error: error.message

        })

    }

}

module.exports = {

    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct

}