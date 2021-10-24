const express = require("express")
const router = new express.Router()
const hbs = require("hbs");
const bcrypt = require("bcryptjs")

const auth = require("../middleware/auth")

const Register = require("../models/dbschema");

router.get("/", async (req, res) => {
    try {
        res.status(201).render("home");

    } catch (error) {
        res.status(401).send(error)
    }
})



router.get("/dashboard", auth, async (req, res) => {
    try {
        res.status(201).render("users/dashboard");

    } catch (error) {
        res.status(401).send(error)
    }
})




router.get("/test", async (req, res) => {
    try {

        res.status(201).render("test");

    } catch (error) {
        res.status(401).send(error)
    }
})



router.get("/logout", auth, async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((elem) => {
            return elem.token != req.token
        })

        res.clearCookie("jwt")

        console.log("Logout Successfully!!");

        await req.user.save()
        res.redirect("/login")

    } catch (error) {
        res.status(500).send(error)
    }
})






router.get("/subs", async (req, res) => {
    try {
        res.status(201).render("subs");

    } catch (error) {
        res.status(401).send(error)
    }
})



router.get("/login", async (req, res) => {
    try {

        res.status(201).render("login/login");

    } catch (error) {
        res.status(401).send(error)
    }
})




router.post("/login", async (req, res) => {
    try {

        const email = req.body.email
        const password = req.body.password

        const useremail = await Register.findOne({ email: email })
        // res.send(useremail)

        const token = await useremail.generateAuthToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true,
            // secure:true   //works on https only
        })




        const isMatch = bcrypt.compare(password, useremail.password)


        if (isMatch) {
            // res.status(201).render("users/dashboard")
            res.redirect('/dashboard');
        } else {
            res.send("Invalid email or passwords")
        }

    } catch (error) {
        res.status(400).send("Error occureed plz try again!!")
    }
})




router.post("/signup", async (req, res) => {
    try {

        const registerUser = new Register({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })
        // console.log(registerUser.username)
        const token = await registerUser.generateAuthToken();

        // console.log(token);
        res.cookie("verUser", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
        })

        console.log("saved");

        const register = await registerUser.save();
        console.log(register);
        res.status(201).render("users/dashboard", { success: true })

    } catch (error) {
        res.status(401).send(error)
    }
})



router.get("/user/author", auth, async (req, res) => {
    try {
        res.status(201).render("users/mainpage");

    } catch (error) {
        res.status(401).send(error)
    }
})


router.get("/user/preview", auth, async (req, res) => {
    try {
        bookid = req.query.id
        console.log(bookid);
        res.status(201).render("users/preview");

    } catch (error) {
        res.status(401).send(error)
    }
})


router.get("/user/subs", auth, async (req, res) => {
    try {
        res.status(201).render("users/subsauth");

    } catch (error) {
        res.status(401).send(error)
    }
})


router.get("/user/mainpage", auth, async (req, res) => {
    try {
        res.status(201).render("users/mainpage");

    } catch (error) {
        res.status(401).send(error)
    }
})

router.get("/user/portfolio", auth, async (req, res) => {
    try {

        res.status(201).render("users/portfolio");

    } catch (error) {
        res.status(401).send(error)
    }
})

router.get("/user/conditions", auth, async (req, res) => {
    try {
        res.status(201).render("users/conditions");

    } catch (error) {
        res.status(401).send(error)
    }
})
router.get("/user/novel", auth, async (req, res) => {
    try {
        res.status(201).render("users/novels");

    } catch (error) {
        res.status(401).send(error)
    }
})


// router.get("/carousel", async (req, res) => {
//     try {

//         res.status(201).render("users/carousel");

//     } catch (error) {
//         res.status(401).send(error)
//     }
// })

// router.get("/dropdown", async (req, res) => {
//     try {
//         const allData = await Schema.find({}).sort({ "name": 1 })
//         // res.status(201).send(allData)
//         res.status(201).render("users/dropdown");

//     } catch (error) {
//         res.status(401).send(error)
//     }
// })



// code for deleting any user
// router.delete("/users/:id", async (req, res) => {
//     try {
//         const _id = req.params.id;
//         const deleteOne = await Schema.findByIdAndDelete(_id)
//         res.status(201).send(deleteOne)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })

module.exports = router