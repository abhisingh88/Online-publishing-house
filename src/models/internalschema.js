const mongoose = require("mongoose")

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

// Defining Schema
const internSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
})

internSchema.methods.generateAuthToken = async function () {
    try {

        const token = jwt.sign({ _id: this._id.toString() }, "secreat key")
        // console.log(token);
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token

    } catch (error) {

        res.send("The error part " + error)
        console.log(error);

    }
}

internSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

// Defining Collection

const Internal = new mongoose.model("Internaldatabase", internSchema)

module.exports = Internal;