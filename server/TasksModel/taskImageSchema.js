import mongoose from "mongoose";

const tasksImageSchema = new mongoose.Schema({
    filename: String,
    path: String
})
const TasksImage = mongoose.model("TasksImage", tasksImageSchema)
export default TasksImage;