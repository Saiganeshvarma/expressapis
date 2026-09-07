var user = require("../model/usermodel")

var bcrypt = require("bcryptjs")

var jwt = require("jsonwebtoken")


// ======================================
// REGISTER
// ======================================

var register = async (req, res) => {

    try {

        var {
            username,
            email,
            password
        } = req.body


        // Validate fields

        if (!username || !email || !password) {

            return res.status(400).json({

                message:
                    "Username, email and password are required"

            })

        }


        // Check if user already exists

        var checkUser = await user.findOne({

            $or: [
                { username: username },
                { email: email }
            ]

        })


        if (checkUser) {

            return res.status(409).json({

                message:
                    "Account already exists. Please login."

            })

        }


        // Generate salt

        var salt =
            await bcrypt.genSalt(10)


        // Hash password

        var hashedPassword =
            await bcrypt.hash(
                password,
                salt
            )


        // Create user

        var newUser = await user.create({

            username: username,

            email: email,

            password: hashedPassword,

            // Always create normal users
            role: "user"

        })


        return res.status(201).json({

            message:
                "Account created successfully",

            data: {

                id: newUser._id,

                username: newUser.username,

                email: newUser.email,

                role: newUser.role

            }

        })


    } catch (error) {

        console.log(
            "Register error:",
            error
        )


        return res.status(500).json({

            message: "Server error",

            error: error.message

        })

    }

}



// ======================================
// LOGIN
// ======================================

var login = async (req, res) => {

    try {

        var {
            username,
            password
        } = req.body


        // Validate fields

        if (!username || !password) {

            return res.status(400).json({

                message:
                    "Username and password are required"

            })

        }


        // Find user

        var checkUser =
            await user.findOne({
                username: username
            })


        if (!checkUser) {

            return res.status(401).json({

                message:
                    "Invalid username or password"

            })

        }


        // Compare password

        var isPassword =
            await bcrypt.compare(
                password,
                checkUser.password
            )


        if (!isPassword) {

            return res.status(401).json({

                message:
                    "Invalid username or password"

            })

        }


        // Create JWT

        var accessToken =
            jwt.sign(

                {
                    userId: checkUser._id,

                    username:
                        checkUser.username,

                    email:
                        checkUser.email,

                    role:
                        checkUser.role

                },

                process.env.jwt_secret_key,

                {
                    expiresIn: "15m"
                }

            )


        return res.status(200).json({

            message: "Login successful",

            token: accessToken

        })


    } catch (error) {

        console.log(
            "Login error:",
            error
        )


        return res.status(500).json({

            message: "Server error",

            error: error.message

        })

    }

}


module.exports = {

    register,

    login

}