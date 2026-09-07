var multer = require("multer")
var path = require("path")
var fs = require("fs")


// ======================================
// UPLOAD DIRECTORY
// ======================================

var uploadDirectory =
    path.join(__dirname, "../uploads")


// Create uploads folder if it doesn't exist

if (!fs.existsSync(uploadDirectory)) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    )

}


// ======================================
// STORAGE
// ======================================

var storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            uploadDirectory
        )

    },


    filename: (req, file, cb) => {

        var uniqueName =
            Date.now() +
            "-" +
            Math.round(
                Math.random() * 1E9
            ) +
            path.extname(file.originalname)


        cb(
            null,
            uniqueName
        )

    }

})


// ======================================
// FILE FILTER
// ======================================

var fileFilter = (req, file, cb) => {

    var allowedTypes = [

        "image/jpeg",

        "image/jpg",

        "image/png",

        "image/webp"

    ]


    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(
            null,
            true
        )

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            )
        )

    }

}


// ======================================
// MULTER
// ======================================

var upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

})


module.exports = upload