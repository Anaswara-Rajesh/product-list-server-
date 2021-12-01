import express from "express";
import cors from 'cors';
import mongoose from 'mongoose';

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())


mongoose.connect("mongodb://localhost:27017/react_applicationDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phonenumber: Number,
    password: String
})

const User = new mongoose.model("User",userSchema)

const adminSchema = new mongoose.Schema({
    email: String,
    password: String
})

const Admin = new mongoose.model("Admin", adminSchema)

//Routes

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            if (password === user.password) {
                res.send({ message: "login Succesfull", user: user })
            } else {
                res.send({ message: "password didn't match" })
            }
        }
        else {
            res.send("User not Registered")
        }
    })
})

app.post("/ad_login", (req, res) => {
    const { email, password } = req.body;
    Admin.findOne({ email: email }, (err, admin) => {
        if (admin) {
            if (password === admin.password) {
                res.send({ message: "login Succesfull", admin: admin })
            } else {
                res.send({ message: "password didn't match" })
            }
        }
        else {
            res.send(" there is no admin ")
        }
    })
})

app.post("/register", (req, res) => {

    const { name, email, phonenumber, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send({ message: "user already registered, please login now.." })
        }
        else {
            const user = new User({
                name,
                email,
                phonenumber,
                password
            })
            user.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "succesfully registered" })
                }

            })
        }
    })

})

app.post("/ad_register", (req, res) => {

    const { email, password } = req.body;
    Admin.findOne({ email: email }, (err, admin) => {
        if (admin) {
            res.send({ message: "admin already registered, please login now.." })
        }
        else {
            const admin = new Admin({
                
                email,
                
                password
            })
            admin.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "succesfully registered" })
                }

            })
        }
    })

})


app.listen(9002, () => {
    console.log("BE started at port 9002");
})
