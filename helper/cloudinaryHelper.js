var cloudinary = require("../config/cloudinary")


// ======================================
// UPLOAD IMAGE TO CLOUDINARY
// ======================================

var uploadToCloudinary = async (filePath) => {

    try {

        var result =
            await cloudinary.uploader.upload(

                filePath,

                {
                    folder: "products"
                }

            )


        return {

            url: result.secure_url,

            publicId: result.public_id

        }


    } catch (error) {

        console.log(
            "Cloudinary upload error:",
            error.message
        )

        throw error

    }

}


module.exports = {

    uploadToCloudinary

}