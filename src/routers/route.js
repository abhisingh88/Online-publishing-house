const express = require("express")
const router = new express.Router()
const hbs = require("hbs");
const bcrypt = require("bcryptjs")
const multer = require("multer")

const auth = require("../middleware/auth")
const authintern = require("../middleware/authintern")

const Register = require("../models/dbschema");
const Internal = require("../models/internalschema");
const BookDB = require("../models/bookschema");
const feedbackScehema = require("../models/feedbackschema");
const publishDB = require("../models/publishschema");

router.get("/", async (req, res) => {
    try {
        res.status(201).render("home");

    } catch (error) {
        res.status(401).send(error)
    }
})


router.get("/subs", async (req, res) => {
    try {
        res.status(201).render("subs");

    } catch (error) {
        res.status(401).send(error)
    }
})

router.post("/feedback", async (req, res) => {
    try {
        const newFile = await feedbackScehema.create({
            feedback: req.body.feedback,
        });
        console.log(newFile)
        res.redirect("/")
        // res.status(201).render("home");

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

// ---------------------------------------------------Internal route------------------------------

router.get("/internal", authintern, async (req, res) => {
    try {
        // res.redirect('internal/internal');
        res.status(201).render("internal/internal")
    } catch (error) {
        res.status(401).send(error)
    }
})

router.get("/internal/acceptbook", authintern, async (req, res) => {
    try {
        id = req.query.id
        // console.log(id);
        res.status(201).render("internal/acceptbook", { authid: id });

    } catch (error) {
        res.status(401).send(error)
    }
})

const multerStorageimg = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `coverimg/admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
});

const multerFilterimg = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "jpg" || file.mimetype.split("/")[1] === "jpeg") {
        cb(null, true);
    } else {
        cb(new Error("Not a jpg/jpeg File!!"), false);
    }
};

const uploadimg = multer({
    // storage: multerStorageimg,
    // fileFilter: multerFilterimg,
    storage: multerStorageimg,
    fileFilter: multerFilterimg
});


router.post("/internal/acceptcontent", uploadimg.single('myFile'), async (req, res) => {
    // console.log(req.body.cover);
    try {
        // console.log("run")
        const newFile = await publishDB.create({
            imagefilename: req.file.filename,
            content: req.body.content,
            authorid: req.body.authorid,
        });
        _id = req.body.authorid;
        // console.log(newFile);
        const updateOne = await BookDB.findByIdAndUpdate(_id, { status: 1 })
        // console.log(updateOne);
        res.redirect("/internal");


    } catch (error) {
        res.json({
            error,
        });
    }
})



router.get("/internal/login", async (req, res) => {
    try {
        res.status(201).render("internal/login");

    } catch (error) {
        res.status(401).send(error)
    }
})

router.post("/internal/login", async (req, res) => {
    try {

        const email = req.body.email
        const password = req.body.password

        const useremail = await Internal.findOne({ email: email })
        // res.send(useremail)

        const token = await useremail.generateAuthToken();

        res.cookie("internal", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true,
            // secure:true   //works on https only
        })




        const isMatch = bcrypt.compare(password, useremail.password)


        if (isMatch) {
            // res.status(201).render("internal/internal")
            res.redirect('/internal');
        } else {
            res.send("Invalid email or passwords")
        }

    } catch (error) {
        res.status(400).send("Error occureed plz try again!!")
    }
})




router.post("/internal/signup", async (req, res) => {
    try {

        const registerUser = new Internal({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })
        // console.log(registerUser.username)
        const token = await registerUser.generateAuthToken();

        // console.log(token);
        res.cookie("internal", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
        })

        console.log("saved");

        const register = await registerUser.save();
        console.log(register);

        // res.status(201).render("internal/internal", { success: true })
        res.redirect('/internal');
    } catch (error) {
        res.status(401).send(error)
    }
})


router.get("/internal/logout", authintern, async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((elem) => {
            return elem.token != req.token
        })

        res.clearCookie("internal")

        console.log("Logout Successfully!!");

        await req.user.save()
        res.redirect("/internal")

    } catch (error) {
        res.status(500).send(error)
    }
})

// ---------------------------------------------------Internal route------------------------------



// ---------------------------------------------------User route------------------------------


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
        verif = req.query.verif
        // console.log(bookid, "and", verif);
        const data = await publishDB.findById({ _id: bookid }, 'content authorid');
        const title = await BookDB.findById({ _id: data.authorid }, 'title');
        if (Number(verif)) {
            data.content = data.content
            // res.redirect("/user/content?id=" + bookid + "&verif=" + verif)
        } else {
            data.content = data.content.slice(1, 800)
        }
        res.status(201).render("users/preview", { data: data, title: title, id: bookid, verif: verif });

    } catch (error) {
        res.status(401).send(error)
    }
})

// router.get("/user/content", auth, async (req, res) => {
//     try {
//         console.log("here in main content")
//         bookid = req.query.id
//         console.log(bookid);
//         const data = await publishDB.findById({ _id: bookid }, 'content authorid');
//         const title = await BookDB.findById({ _id: data.authorid }, 'title');
//         // data.content = data.content.slice(1, 800)
//         res.status(201).render("users/content", { data: data, title: title, id: bookid, verif: verif });

//     } catch (error) {
//         res.status(401).send(error)
//     }
// })

// router.get("/user/middle", auth, async (req, res) => {
//     try {
//         bookid = req.query.id
//         res.redirect("/user/content?id=" + bookid)
//     } catch (error) {
//         res.status(401).send(error)
//     }
// })


router.get("/dashboard", auth, async (req, res) => {
    try {
        res.status(201).render("users/dashboard");

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


router.get("/user/previewsubs", auth, async (req, res) => {
    try {
        bookid = req.query.id
        console.log(bookid);
        res.status(201).render("users/previewsubs", { id: bookid });

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
        const data = await publishDB.find({}, '_id authorid imagefilename');
        // console.log(data);
        res.status(201).render("users/novels", { data: data });

    } catch (error) {
        res.status(401).send(error)
    }
})
// ---------------------------------------------------User route------------------------------



// ---------------------------------------------------Book route------------------------------

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "pdf") {
        cb(null, true);
    } else {
        cb(new Error("Not a PDF File!!"), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});


router.post("/author/stdpub", upload.single('myFile'), async (req, res) => {
    try {
        const newFile = await BookDB.create({
            filename: req.file.filename,
            authorname: req.body.authorname,
            email: req.body.email,
            contact: req.body.phone,
            title: req.body.title,
        });


        // res.status(200).json({
        //     status: "success",
        //     message: "File created successfully!!",
        // });


        res.status(201).render("users/submissionres", { success: true });


    } catch (error) {
        res.json({
            error,
        });
    }
})


// File for internal
router.get("/api/getFiles", async (req, res) => {
    try {
        const files = await BookDB.find({ status: 0 });
        res.status(200).json({
            status: "success",
            files,
        });
        // console.log(files);
    } catch (error) {
        res.json({
            status: "Fail",
            error,
        });
    }
})

// File for feedback
router.get("/api/getFeedback", async (req, res) => {
    try {
        const files = await feedbackScehema.find({});
        res.status(200).json({
            status: "success",
            files,
        });
        console.log(files);
    } catch (error) {
        res.json({
            status: "Fail",
            error,
        });
    }
})

router.post("/author/selfpub", async (req, res) => {
    try {
        const newFile = await BookDB.create({
            filename: req.file.filename,
            authorname: req.body.authorname,
            email: req.body.email,
            contact: req.body.phone,
            title: req.body.title,
        });


        // res.status(200).json({
        //     status: "success",
        //     message: "File created successfully!!",
        // });


        res.status(201).render("users/submissionres", { success: true });


    } catch (error) {
        res.json({
            error,
        });
    }
})


// ---------------------------------------------------Book route------------------------------



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