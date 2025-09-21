import express, { urlencoded } from "express";
import TasksRoutes from "./TasksRoutes/tasksRoute.js";
import cors from "cors";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const API = process.env.API;
const app = express();
import mongoose from "mongoose";
app.use(cors({
    origin: API,
    credentials: true,
}))
const mongooseConnect = async () => {
    try {
        await mongoose.connect(MONGO_URI)
    } catch (e) {
        console.log("mongoose error", e)
    }
}
mongooseConnect();
app.use(express.urlencoded({ extended: "true" }));
app.use(express.json());
app.use("/api/tasks", TasksRoutes);
import TasksAuthRoutes from "./TasksRoutes/tasksAuthRoutes.js";
app.use("/api/tasks/auth", TasksAuthRoutes);
app.listen(PORT, () => {
    console.log("Port Working", PORT);
})