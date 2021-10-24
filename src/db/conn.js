const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/BookHouseUserDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false

}).then(() => {
    console.log("Connection Succesful");
}).catch((e) => {
    console.log("No connection and error is ", e);
})