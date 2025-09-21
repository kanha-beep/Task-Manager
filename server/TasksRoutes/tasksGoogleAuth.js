// /api/tasks/auth/google
    // callbackURL: "/auth/google/callback"
    //tasksGoogleAuth.js
import express from "express"
const router = express.Router();
import passport from "passport";
router.get("/", passport.authenticate("google", {scope: ["profile", "email"]}));
router.get("/callback", passport.authenticate({failureRedirect: "/api/tasks/auth/login"}), (req,res)=>{
    res.redirect("/api/tasks");
})
export default router