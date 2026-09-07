var express = require("express")
var dotenv = require("dotenv")

// Load environment variables FIRST
dotenv.config()

var connectToDataBase = require("./database/db.js")

var authRoutes = require("./routes/auth-routes.js")
var productRoutes = require("./routes/productroutes.js")
var cartRoutes=require("./routes/cartroutes")
var paymentRoute=require("./routes/paymentroute")

var app = express()


// ======================================
// MIDDLEWARE
// ======================================

app.use(express.json())

app.use(express.urlencoded({
    extended: true
}))


// ======================================
// DATABASE CONNECTION
// ======================================

connectToDataBase()


// ======================================
// ROUTES
// ======================================

app.use("/api/auth", authRoutes)

app.use("/api", productRoutes)

app.use("/api",cartRoutes)

app.use("/api",paymentRoute)

// ======================================
// HOME ROUTE
// ======================================

app.get("/", (req, res) => {

    res.status(200).json({

        message: "E-commerce API is running"

    })

})


// ======================================
// 404 ROUTE
// ======================================

app.use((req, res) => {

    res.status(404).json({

        message: "Route not found"

    })

})


// ======================================
// SERVER
// ======================================

var PORT = process.env.PORT || 5000


app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`)

})





