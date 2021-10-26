const jwt = require("jsonwebtoken")
const Internal = require("../models/internalschema")
// const cookieParser = require("cookie-parser")

const authintern = async (req, res, next) => {
    try {

        const token = req.cookies.internal
        const verifyUser = jwt.verify(token, "secreat key")
        // console.log(verifyUser)
        const user = await Internal.findOne({ _id: verifyUser._id })
        // console.log(user);
        req.user = user
        req.token = token
        next()

    } catch (error) {
        res.redirect("/internal/login")
    }
}

module.exports = authintern;