import express from "express";
const router = express.Router();
import User from "../TasksModel/userSchema.js";
import bcrypt from "bcrypt"
import { validateUserSchema , taskValidation} from "../Middlewares/TasksValidate.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();
// eslint-disable-next-line no-undef
const JWT_SECRET = process.env.JWT_SECRET
console.log("secret key", JWT_SECRET)
//api/tasks/auth
//sign up
router.post("/signup", async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) return res.status(401).json("please enter details");
    try {
        const existingUser = await User.findOne({ username });
        console.log("2. searched existing user from db", existingUser)
        if (existingUser) return res.status(402).json("user already exists");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("3. Password Hashed", hashedPassword)
        if (!hashedPassword) return res.status(403).json("password not created");
        const newUser = await User.create({ username, password: hashedPassword, email })
        console.log("new user saved", newUser)
        res.json(newUser)
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

//login
router.post("/login", async (req, res) => {
    try {
        if (!req.body) return res.status(401).json("no details to login")
        const { username, password, email } = req.body;
        if (!username || !password || !email) return res.status(402).json("invalid details");
        const existingUser = await User.findOne({ username });
        // console.log("1. existing user", existingUser);
        if (!existingUser) return res.status(403).json({ message: "user not registered" });
        if (!existingUser.password) return res.status(407).json("password not in db");
        const { error } = validateUserSchema.validate(req.body, { stripUnknown: true });
        // console.log("joi error for login", error)
        if (error) return res.status(404).json("invalid from joi");//
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) return res.status(405).json("password is wrong");
        // console.log("id of existing user", existingUser._id)
        const token = jwt.sign({ _id: existingUser._id }, JWT_SECRET, { expiresIn: "1hr" });
        // console.log("token:", token);
        res.json({ token });
    } catch (e) {
        console.log("error of login", e)
        res.status(500).json({ message: "Server error" });
    }
})
export default router