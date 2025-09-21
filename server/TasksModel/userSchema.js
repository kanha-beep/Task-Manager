import mongoose, { Mongoose } from "mongoose";
const userSchema = new mongoose.Schema({
    email: String,
    googleId: String,
    username: String,
    password: String
})
const User = mongoose.model("User", userSchema)
export default User;