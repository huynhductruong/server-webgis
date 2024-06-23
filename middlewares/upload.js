import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      cb(null, 'F:/Webgis-server/uploads');
    } catch (error) {
      cb("Khong tim thay duong dan")
    }
  },
  filename: (req, file, cb) => {
    try {
      cb(null, file.originalname);
    } catch (error) {
       
      cb(error)
    }
  }
});
const upload = multer({ storage });
export default upload


