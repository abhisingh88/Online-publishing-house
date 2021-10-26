const mongoose = require("mongoose")

// Defining Schema
const publishschema = new mongoose.Schema({
    authorid: {
        type: String,
        // required: true
    },
    imagefilename: {
        type: String,
        // required: true
    },
    content: {
        type: String,
        // required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
})


// Defining Collection

const PublishSchema = new mongoose.model("PublishDatabase", publishschema)

module.exports = PublishSchema;