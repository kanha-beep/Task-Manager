import mongoose from "mongoose";


const tasksSchema = new mongoose.Schema({
    name: String,
    dueDate: {
        type: Date,
    },
    owner: String,
    desc: String,
    completed: {
        type: Boolean,
        default: false
    },
    check: {
        type: Boolean,
        default: false
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"TasksImage"
    },
    boss: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    priority: String,
})
const Task = mongoose.model("Task", tasksSchema)
export default Task;

