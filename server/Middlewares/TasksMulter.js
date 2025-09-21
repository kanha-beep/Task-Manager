import multer from "multer"
import path from "path"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "tasksUploads/")
        // console.log("image uploaded in folder")
    },
    filename: function (req, file, cb) {
        const prefix = Date.now() + path.extname(file.originalname);
        cb(null, prefix)
        // console.log("image got its name")
    }
})
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const allowedTypes = /jpeg|png|jpg/
    try {
        if (allowedTypes.test(ext)) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    } catch (e) {
        console.log("error in img", e)
    }

}
const uploads = multer({ storage, fileFilter })
// console.log("image passed multer successfully")
export default uploads