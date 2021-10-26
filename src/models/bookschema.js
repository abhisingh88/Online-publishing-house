const mongoose = require("mongoose")

// Defining Schema
const bookSchema = new mongoose.Schema({
    authorname: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true,
        // unique: true
    },
    contact: {
        type: String,
        // required: true
    },
    title: {
        type: String,
        // required: true
    },
    status: {
        type: Number,
        // required: true
    },
    filename: {
        type: String,
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },


})


// Defining Collection

const BookDB = new mongoose.model("BookDatabase", bookSchema)

module.exports = BookDB;