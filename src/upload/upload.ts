import multer from "multer";
import path from "path";

const storage: multer.StorageEngine = multer.diskStorage({
    destination: (req, file, func) => {
        func(null, "storage/images");
    },

    filename: (req, file, func ) => {
        func(null, Date.now() + path.extname(file.originalname))
    }
})

const upload: multer.Multer = multer({storage: storage});

export default upload;