import  multer from  "multer";
import  path from  "path";

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp"); // Temporary directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()+ '-' + path.extname(file.originalname)); // Unique file name
  },
});

export const upload = multer({ storage });
