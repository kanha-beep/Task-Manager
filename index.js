import path from "path";
import express from "express";
const app = express();
import { fileURLToPath } from "url";
import uploads from "./multer.js";
import uploadsLargeImage from "./LargeImageMulter.js"
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./src/auth_form/GoogleAuth.js";
// import flash from "connect-flash"
// import fs from 'fs';
import mongoose from 'mongoose';
import Image from "./src/models/imageSchema.js"
import Form from "./src/models/formSchema.js"
import LargeImage from "./src/models/largeImageSchema.js"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "yourSecretKey", // can be anything, but keep it secret
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:5173", credentials: true
  })
);
import dotenv from "dotenv";
dotenv.config();
// tasks
import taskRoute from "./src/routes/tasksRoute.js"
app.use("/api/tasks", taskRoute)
//auth
import tasksAuthRoutes from "./src/routes/tasksAuthRoutes.js";
app.use("/api/tasks/auth", tasksAuthRoutes);
//google
import tasksGoogleAuth from "./src/routes/tasksGoogleAuth.js"
app.use("/api/tasks/auth/google", tasksGoogleAuth);
//products
import productsRoutes from "./src/ProductsRoutes/productsRoute.js"
app.use("/api/products", productsRoutes)
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gallery')
  .then(() => console.log('MongoDB connected for gallery'))
  .catch(err => console.log('MongoDB connection error:', err));
// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploadsLargeImage", express.static(path.join(__dirname, "uploadsLargeImage")));
app.use("/tasksUploads", express.static(path.join(__dirname, "tasksUploads")));
app.use(express.static(path.join(__dirname, "/")));
app.post("/posts/image", uploads.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const filePath = req.file.path;
  console.log("image uploaded", filePath);
  res.json({ url: `/uploads/${req.file.filename}` });
});


app.post("/uploads", uploads.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const fpath = req.file.path;
  if (!fpath) return res.status(400).json({ message: "NO path" })
  const filePath = `/uploads/${fpath}`;
  try {
    const newImage = new Image({
      filename: req.file.filename,
      path: filePath
    });
    await newImage.save();
    res.json({
      message: "Upload successful",
      file: filePath,
      id: newImage._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all images
app.get("/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//form submit and send to whatsapp
app.post("/form", async (req, res) => {
  const { name, username, desc } = req.body;
  if (!name || !username || !desc) return res.status(400).json({ error: "no form data found" });
  try {
    const newForm = await Form.create({ name, username, desc })
    console.log("form saved backend")
    // // 2️⃣ Send to WhatsApp
    // const token = "YOUR_WHATSAPP_TOKEN"; // from Meta
    // const phoneNumberId = "YOUR_PHONE_NUMBER_ID"; // from Meta
    // const to = "YOUR_PERSONAL_WHATSAPP_NUMBER"; // where you receive message
    // await axios.post(
    //   `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
    //   {
    //     messaging_product: "whatsapp",
    //     to: to,
    //     text: {
    //       body: `📩 New Form Submission: Name: ${name} Username: ${username} Desc: ${desc}`,
    //     },
    //   },
    //   { headers: { Authorization: `Bearer ${token}` } }
    // );
    res.json({ newForm })
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
})
//large image get
app.get("/largeImage", async (req, res) => {
  try {
    const getImage = await LargeImage.find({});
    if (getImage === 0) return res.status(500).json({ error: "no image got from mongo to show" })
    res.json(getImage)
  } catch (e) {
    res.status(500).json({ error: e.message });

  }
})

app.post("/uploadsLargeImage", uploadsLargeImage.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    // Map through all uploaded files
    const images = req.files.map(file => ({
      filename: file.filename,
      path: path.join("uploadsLargeImage", file.filename),
    }));
    // Save all images in MongoDB
    const savedImages = await LargeImage.insertMany(images);
    res.json(savedImages);
    console.log("Images uploaded successfully");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get("/", (req, res) => {
  console.log("GET / hit");
  res.send("Server is running");
});
app.listen(3000, () => console.log("Server running on port 3000"));