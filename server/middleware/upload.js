import multer from "multer";
/* All uploaded files go into the uploads/ folder.
   Each file will get unique name by adding current time + original file name
*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// only image (jpeg, png, jpg) and video (mp4, mkv, mov, quicktime) files are allowed others are not allowed
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/mkv",
    "video/quicktime",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"), false);
  }
};
// upload.single("media") in routes to upload single file
const upload = multer({ storage, fileFilter });

export default upload;