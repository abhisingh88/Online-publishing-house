const mongoose = require("mongoose")

// Defining Schema
const feedbackSchema = new mongoose.Schema({
    feedback: {
        type: String,
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },


})


// Defining Collection

const feedbackScehema = new mongoose.model("feedbackDatabase", feedbackSchema)

module.exports = feedbackScehema;