import fs from "fs";
import logger from "../../logger/winston.logger.js";

import slugify from "slugify";
import crypto from "crypto";

/**
 * Generate a URL-safe slug, with a random suffix to ensure uniqueness
 */
export const generateSlug = (text, suffix = "") => {
  const base = slugify(text, { lower: true, strict: true, trim: true });
  return suffix ? `${base}-${suffix}` : base;
};

/**
 * Generate a short random hex string (for slug uniqueness)
 */
export const randomHex = (bytes = 4) =>
  crypto.randomBytes(bytes).toString("hex");

/**
 * Pick only allowed keys from an object (safe update payloads)
 */
export const pick = (obj, keys) =>
  keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) acc[key] = obj[key];
    return acc;
  }, {});

/**
 * Omit keys from an object (e.g. remove password before returning user)
 */
export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach((k) => delete result[k]);
  return result;
};

/**
 * Check if a value is a non-empty string
 */
export const isNonEmptyString = (val) =>
  typeof val === "string" && val.trim().length > 0;

/**
 * Normalize array from possibly string input (tags, ids)
 */
export const normalizeArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return val.split(",").map((v) => v.trim());
    }
  }
  return [];
};

/**
 *
 * @param {string[]} fieldsArray
 * @param {any[]} objectArray
 * @returns {any[]}
 * @description utility function to only include fields present in the fieldsArray
 * For example,
 * ```js
 * let fieldsArray = [
 * {
 * id:1,
 * name:"John Doe",
 * email:"john@doe.com"
 * phone: "123456"
 * },
 * {
 * id:2,
 * name:"Mark H",
 * email:"mark@h.com"
 * phone: "563526"
 * }
 * ]
 * let fieldsArray = ["name", "email"]
 * 
 * const filteredKeysObject = filterObjectKeys(fieldsArray, fieldsArray)
 * console.log(filteredKeysObject) 
 * 
//  Above line's output will be:
//  [
//      {
//        name:"John Doe",
//        email:"john@doe.com"
//      },
//      {
//        name:"Mark H",
//        email:"mark@h.com"
//      }
//  ]
 * 
 * ```
 */
export const filterObjectKeys = (fieldsArray, objectArray) => {
  const filteredArray = structuredClone(objectArray).map((originalObj) => {
    let obj = {};
    structuredClone(fieldsArray)?.forEach((field) => {
      if (field?.trim() in originalObj) {
        obj[field] = originalObj[field];
      }
    });
    if (Object.keys(obj).length > 0) return obj;
    return originalObj;
  });
  return filteredArray;
};

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

/**
 *
 * @param {any[]} dataArray
 * @param {number} page
 * @param {number} limit
 * @returns {{previousPage: string | null, currentPage: string, nextPage: string | null, data: any[]}}
 */
export const Paginate = async ({
  model,
  page = 1,
  limit = 10,
  where = {},
  orderBy,
  paginate: doPaginate = true,
}) => {
  if (!doPaginate) {
    const docs = await model.findMany({ where, orderBy });
    return {
      page: 1,
      limit: docs.length,
      totalPages: 1,
      previousPage: false,
      nextPage: false,
      totalItems: docs.length,
      currentPageItems: docs.length,
      data: docs,
    };
  }

  const totalItems = await model.count({ where });
  const totalPages = Math.ceil(totalItems / limit);

  const docs = await model.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    page,
    limit,
    totalPages,
    previousPage: page > 1,
    nextPage: page < totalPages,
    totalItems,
    currentPageItems: docs.length,
    data: docs,
  };
};

export const tryUpload = async (buffer, folder, options = {}) => {
  let lastErr;
  for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt++) {
    try {
      const res = await uploadToCloudinary(buffer, folder, options);
      return res;
    } catch (err) {
      lastErr = err;
      // small backoff for retry
      await new Promise((r) => setTimeout(r, 200 * attempt));
    }
  }
  const e = new Error("Cloudinary upload failed after retries");
  e.cause = lastErr;
  throw e;
};

/**
 *
 * @param {import("express").Request} req
 * @param {string} fileName
 * @description returns the file's static path from where the server is serving the static image
 */
export const getStaticFilePath = (req, fileName) => {
  return `${req.protocol}://${req.get("host")}/images/${fileName}`;
};

/**
 *
 * @param {string} fileName
 * @description returns the file's local path in the file system to assist future removal
 */
export const getLocalPath = (fileName) => {
  return `public/images/${fileName}`;
};

/**
 *
 * @param {string} localPath
 * @description Removed the local file from the local file system based on the file path
 */
export const removeLocalFile = (localPath) => {
  fs.unlink(localPath, (err) => {
    if (err) logger.error("Error while removing local files: ", err);
    else {
      logger.info("Removed local: ", localPath);
    }
  });
};

/**
 * @param {import("express").Request} req
 * @description **This utility function is responsible for removing unused image files due to the api fail**.
 *
 * **For example:**
 * * This can occur when product is created.
 * * In product creation process the images are getting uploaded before product gets created.
 * * Once images are uploaded and if there is an error creating a product, the uploaded images are unused.
 * * In such case, this function will remove those unused images.
 */
export const removeUnusedMulterImageFilesOnError = (req) => {
  try {
    const multerFile = req.file;
    const multerFiles = req.files;

    if (multerFile) {
      // If there is file uploaded and there is validation error
      // We want to remove that file
      removeLocalFile(multerFile.path);
    }

    if (multerFiles) {
      /** @type {Express.Multer.File[][]}  */
      const filesValueArray = Object.values(multerFiles);
      // If there are multiple files uploaded for more than one fields
      // We want to remove those files as well
      filesValueArray.map((fileFields) => {
        fileFields.map((fileObject) => {
          removeLocalFile(fileObject.path);
        });
      });
    }
  } catch (error) {
    // fail silently
    logger.error("Error while removing image files: ", error);
  }
};

/**
 * @param {number} max Ceil threshold (exclusive)
 */
export const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};
