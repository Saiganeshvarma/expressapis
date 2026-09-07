var jwt = require("jsonwebtoken")


var authMiddleware = (req, res, next) => {

    try {

        var authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({
                message: "Token not found"
            })
        }

        var token = authHeader.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                message: "Invalid authorization format"
            })
        }

        var decode = jwt.verify(
            token,
            process.env.jwt_secret_key
        )

        req.user = decode

        next()

    } catch (error) {

        console.log("error", error)

        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}


module.exports = authMiddleware