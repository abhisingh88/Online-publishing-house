const jwt = require("jsonwebtoken")
const Register = require("../models/dbschema")
// const cookieParser = require("cookie-parser")

const auth = async (req, res, next) => {
    try {

        const token = req.cookies.jwt
        const verifyUser = jwt.verify(token, "secreat key")
        // console.log(verifyUser)
        const user = await Register.findOne({ _id: verifyUser._id })
        // console.log(user);
        req.user = user
        req.token = token
        next()

    } catch (error) {
        res.redirect("/login")
    }
}

module.exports = auth;