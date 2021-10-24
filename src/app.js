require('dotenv').config()

const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs");
const cookieParser = require('cookie-parser')


require("./db/conn")


const static_path = path.join(__dirname, "../public")
app.use(express.static(static_path))

const router = require("./routers/route")
const port = process.env.PORT || 3000


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))



// Handlerbar config
const template_path = path.join(__dirname, "../templates/views")
const parials_path = path.join(__dirname, "../templates/partials")
app.set("view engine", "hbs");

app.set("views", template_path)
hbs.registerPartials(parials_path)



// Route to the file
app.use(router)


app.listen(port, () => {
    console.log(`server is running at port no. ${port}`);
})