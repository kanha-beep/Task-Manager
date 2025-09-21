import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const verifyToken = (req, res, next) => {
    const auth = req.headers["authorization"];
    // console.log("auth", auth);
    const token = auth.split(" ")[1];
    // console.log("token", token);
    jwt.verify(token, JWT_SECRET, (error, user) => {
        if (error) return res.status(401).json("error user not verified")
        req.user = user;
        // console.log("user saved", req.user);
        next()
    })
}
export default verifyToken;