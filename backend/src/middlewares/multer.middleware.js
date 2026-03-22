import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp");
//   },
//   filename: function (req, file, cb) {
//     // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     // cb(null, file.fieldname + "-" + uniqueSuffix);
//     cb(null, file.originalname);
//   },
// });

// export const upload = multer({ storage: storage });

const memoryStorage = multer.memoryStorage();

/* ---------------- GENERIC UPLOAD ---------------- */
const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

/* ---------------- IMAGE UPLOAD ---------------- */
const imageUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "image"));
    }
    cb(null, true);
  },
});

/* ---------------- VIDEO UPLOAD ---------------- */
const videoUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "video"));
    }
    cb(null, true);
  },
});

/* ---------------- DOCUMENT UPLOAD ---------------- */
const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  // "application/msword",
  // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // "image/jpeg",
  // "image/png",
];

const documentUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only PDF allowed"),
      );
    }
    cb(null, true);
  },
});

export { upload, imageUpload, videoUpload, documentUpload };
