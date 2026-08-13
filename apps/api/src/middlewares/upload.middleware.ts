import multer from "multer";
import { AppError } from "../errors/AppError.js";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(
        new AppError("Only image files are allowed", 415),
      );
    }

    callback(null, true);
  },
});