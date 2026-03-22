import cloudinary from "../../config/cloudinary.config.js";
import fs from "fs";
import { Readable } from "stream";
import logger from "../../logger/winston.logger.js";

/**
 * Upload a file from either local temp path or in-memory buffer to Cloudinary
 */
export const uploadToCloudinary = async (fileInput, folder = "general") => {
  if (!fileInput) return null;

  try {
    if (Buffer.isBuffer(fileInput)) {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder,
          },
          (err, result) => {
            if (err) {
              logger.error("Cloudinary upload error:", err);
              reject(err);
              return;
            }

            resolve(result ?? null);
          },
        );

        Readable.from(fileInput).pipe(uploadStream);
      });
    }

    const localFilePath = fileInput;
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder,
    });

    fs.unlinkSync(localFilePath); // clean up temp file
    return result;
  } catch (err) {
    logger.error("Cloudinary upload error:", err);
    if (typeof fileInput === "string" && fs.existsSync(fileInput)) {
      fs.unlinkSync(fileInput);
    }
    return null;
  }
};

/**
 * Delete a file from Cloudinary by public_id
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    logger.error("Cloudinary delete error:", err);
    return null;
  }
};

/**
 * Extract public_id from a Cloudinary URL
 */
export const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.split(".")[0];
};
