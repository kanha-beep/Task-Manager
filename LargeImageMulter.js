import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadsLargeImage/");
  },
  // filename: function (req, file, cb) {
  //   const prefix = Date.now() + path.extname(file.originalname);
  //   cb(null, prefix + path.extname(file.originalname));
  // },
  filename: function (req, file, cb) {
  const prefix = Date.now();
  cb(null, prefix + path.extname(file.originalname));
},
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|png|jpg/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const uploadsLargeImage = multer({ storage, fileFilter });
export default uploadsLargeImage;
