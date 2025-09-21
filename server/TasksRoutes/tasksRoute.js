import express from "express"
import Task from "../TasksModel/tasksSchema.js"
const router = express.Router()
import verifyToken from "../Middlewares/middleware.js"
import Tasks from "../TasksModel/tasksSchema.js"
import uploads from "../Middlewares/TasksMulter.js"
import Image from "../TasksModel/taskImageSchema.js"
import { taskValidation, validateUserSchema } from "../Middlewares/TasksValidate.js";
import cron from "node-cron"
//api/tasks
// import flash from "connect-flash"
// console.log("/api/tasks/new is ready")
//crons
//deadline
cron.schedule("*/10 * * * * *", async ()=> {
//     const now = new Date();
//     // console.log("current date: ", now);
//     const after = new Date();
// const nextTime = after.setDate(now.getDate() + 5);
    // console.log("next month: ", nextTime)
    // const tasks = await Tasks.find({dueDate: {$gte: now, $lte: nextTime}});
    // console.log("all tasks: ", tasks)
    // for(let task of tasks) {
    // console.log("pending task: ", task);
    // }
})
//send mail
//new tasks
router.post("/new", verifyToken, async (req, res) => {
    try {
        const { error, value } = taskValidation.validate(req.body);
        const { _id } = req.user;
        // console.log("boss of new task", _id)
        // console.log("validation end")
        // console.log("req.body", req.body)
        // console.log("all values got form front in form of re.body", value)
        if (error) {
            console.log("error of joi", error)
            return res.status(400).json("no proper task details")
        };
        // console.log("Error got while checking schema and before creating new tasks:", error);
        const newTask = await Tasks.create({ ...value, completed: false, boss: _id });
        // console.log("boss id", id)
        // console.log("new task with completed", newTask)
        res.json(newTask)
    } catch (e) {
        console.log("error", e)
    }
})
//get task by id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // console.log("id of one task", id)
        const task = await Task.findById(id).populate("image").populate("boss");
        if (!task) {
            console.log("task not found")
            return res.status(410).json({ message: "user not found" })
        }
        console.log("boss of this task:", task.boss)
        res.json(task);
    } catch (e) {
        console.log("error from backend for single task", e)
    }
})
//image
router.post("/:id/image", uploads.single("image"), async (req, res) => {
    const { id } = req.params;
    const { filename } = req.file
    // console.log("now will break filename", req.file)
    // const {filename} = req.files;
    const newImage = await Image.create({ filename, path: req.file.path });
    // console.log("image schema updated",newImage );
    if (!req.file) return res.status(404).json({ message: "no image" })
    // console.log('image id', newImage._id)
    const task = await Task.findByIdAndUpdate(id, { image: newImage._id }).populate("image")
    await task.save();
    // console.log("task saved with image", task)
    // console.log("name image:", filename)
    res.json(task);
})
//update completed
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(400).json("no proper task found");
        // console.log("req.body for check", req.body)
        if (typeof req.body.completed === "boolean") {
            task.completed = req.body.completed;
        }
        if (typeof req.body.check === "boolean") {
            task.check = req.body.check;
        }
        // console.log("marked the task for new code", req.body.completed)
        await task.save();
        res.json(task);
    } catch (e) {
        console.log("error backend", e)
    }
})
//edit
router.patch("/:id/edit", async (req, res) => {
    try {
        const { id } = req.params;
        // if (req.body) console.log("req.body for edit", req.body)
        const { value, error } = validateTasksSchema.validate(req.body);
        if (error) return res.status(400).json("no edit");
        const task = await Task.findByIdAndUpdate(id, value);
        // console.log("id for edit", id)
        // console.log("task editted", task);
        res.json(task)
    } catch (e) {
        console.log("error edit", e)
    }
})
//delete tasks
router.delete("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    res.json(task);
})
//get all tasks
router.get("/", verifyToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const pager = parseInt(req.query.pager) || 1;
        // console.log("page is changing", req.query.pager)
        const skip = (pager - 1) * limit;
        //filter
        const filter = req.query.filter || "all"
        const query = {};
        if(filter === "done") query.completed = true;
        else if(filter === "pending") query.completed = false;
        else if (filter === "practice") query.check = true;
        const filterDue = req.query.filter;    // empty, filled
        // console.log("filtr due: ", filterDue)
        if (filterDue === "dueDate") query.dueDate = { $nin: [null, ""] };
        //search
        const search = req.query.search
        // console.log("search: ", search);
        // console.log("filter: ", filter)
        if(search) query.name = {$regex: search, $options: "i"}
        // console.log("tasks is working")
        // sort
    const sort = req.query.sort;
    let sortOption = {};
    console.log("sort: ", sort)
    if (sort === "title") sortOption = { name: 1 }; // A→Z
    else if (sort === "date") sortOption = { _id: -1 }; // newest first
        // find total no of posts
        const tasks = await Tasks.find(query).sort(sortOption).skip(skip).limit(limit)
        if (!tasks) return res.status(444).json({ message: " Log in first" })
        //find total no of pages
        const totalNoOfTasks = await Tasks.countDocuments();
        // console.log("total no of tasks", totalNoOfTasks)
        const totalPagesPerPage = Math.ceil(totalNoOfTasks / limit)
        // console.log("total pages: ", totalPagesPerPage)
        res.json({ message: "user token validated last step", user: req.user, tasks, totalNoOfTasks, totalPagesPerPage, pager: pager })
    } catch (error) {
        console.log("error while rendering all tasks", error)
    }
})

export default router;

// router.get("/", verifyToken, async (req, res) => {
//     try {
//         const limit = parseInt(req.query.limit) || 5;
//         const pager = parseInt(req.query.pager) || 1;
//         console.log("page is changing", req.query.pager)
//         const skip = (pager - 1) * limit;
//         //filter
        
//         // console.log("tasks is working")
//         // find total no of posts
//         const tasks = await Tasks.find({}).skip(skip).limit(limit)
//         if (!tasks) return res.status(444).json({ message: " Log in first" })
//         //find total no of pages
//         const totalNoOfTasks = await Tasks.countDocuments();
//         console.log("total no of tasks", totalNoOfTasks)
//         const totalPagesPerPage = Math.ceil(totalNoOfTasks / limit)
//         console.log("total pages: ", totalPagesPerPage)
//         res.json({ message: "user token validated last step", user: req.user, tasks, totalNoOfTasks, totalPagesPerPage, pager: pager })
//     } catch (error) {
//         console.log("error while rendering all tasks", error)
//     }
// })