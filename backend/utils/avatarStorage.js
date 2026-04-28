import path from "path";
import { Readable } from "stream";
import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";

const AVATAR_BUCKET_NAME = "avatars";

const getDatabase = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("Database connection is not ready");
  }

  return db;
};

const getAvatarBucket = () => {
  return new GridFSBucket(getDatabase(), { bucketName: AVATAR_BUCKET_NAME });
};

const sanitizeFilename = (filename = "avatar") => {
  const extension = path.extname(filename).toLowerCase();
  const baseName = path.basename(filename, extension).replace(/[^a-zA-Z0-9-_]/g, "-");

  return `${baseName || "avatar"}${extension}`;
};

export const buildAvatarUrl = (avatarFileId, avatarVersion = Date.now()) => {
  if (!avatarFileId) {
    return "/user.png";
  }

  return `/api/users/avatar/${avatarFileId}?v=${avatarVersion}`;
};

export const resolveUserAvatar = (user) => {
  if (user?.avatarFileId) {
    return buildAvatarUrl(user.avatarFileId, user.avatarVersion);
  }

  if (typeof user?.avatar === "string" && user.avatar.trim()) {
    return user.avatar;
  }

  return "/user.png";
};

export const uploadAvatarToStorage = async ({ userId, file }) => {
  if (!file?.buffer?.length) {
    throw new Error("Avatar file buffer is empty");
  }

  const bucket = getAvatarBucket();
  const avatarVersion = Date.now();
  const uploadStream = bucket.openUploadStream(sanitizeFilename(file.originalname), {
    contentType: file.mimetype,
    metadata: {
      ownerId: userId,
      category: "avatar",
      uploadedAt: new Date(),
      originalName: file.originalname
    }
  });

  await new Promise((resolve, reject) => {
    Readable.from(file.buffer)
      .pipe(uploadStream)
      .on("error", reject)
      .on("finish", resolve);
  });

  return {
    avatarFileId: uploadStream.id.toString(),
    avatarVersion,
    avatarUrl: buildAvatarUrl(uploadStream.id.toString(), avatarVersion)
  };
};

export const deleteAvatarFromStorage = async (avatarFileId) => {
  if (!avatarFileId) {
    return;
  }

  try {
    const bucket = getAvatarBucket();
    await bucket.delete(new ObjectId(avatarFileId));
  } catch (error) {
    if (error?.code !== 26) {
      throw error;
    }
  }
};

export const streamAvatarFromStorage = async (avatarFileId, res) => {
  const db = getDatabase();
  const filesCollection = db.collection(`${AVATAR_BUCKET_NAME}.files`);
  const fileDocument = await filesCollection.findOne({ _id: new ObjectId(avatarFileId) });

  if (!fileDocument) {
    return false;
  }

  res.setHeader("Content-Type", fileDocument.contentType || "application/octet-stream");
  res.setHeader("Content-Length", fileDocument.length.toString());
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

  const bucket = getAvatarBucket();

  await new Promise((resolve, reject) => {
    bucket.openDownloadStream(fileDocument._id)
      .on("error", reject)
      .on("end", resolve)
      .pipe(res);
  });

  return true;
};
