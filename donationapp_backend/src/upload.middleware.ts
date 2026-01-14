import multer, { StorageEngine, FileFilterCallback } from "multer";
// import path from "path";
// import fs from "fs";
import { Request } from "express";
// import { randomUUID } from "crypto";

/* =====================================================
   ❌ LOCAL STORAGE (ของเดิม) — ปิดไว้ก่อน
   ใช้ได้เฉพาะ local / Windows เท่านั้น
   ===================================================== */

// const sharedProfileDir = "C:\\Users\\supks\\Documents\\donationAppDev\\shared\\images\\profiles";
// const sharedAudioDir = "C:\\Users\\supks\\Documents\\donationAppDev\\shared\\audios\\voiceRef";

// console.log(sharedProfileDir);
// if (!fs.existsSync(sharedAudioDir)) {
//   fs.mkdirSync(sharedAudioDir, { recursive: true });
// }

// const storage: StorageEngine = multer.diskStorage({
//   destination: (req: Request, file: Express.Multer.File, cb) => {
//     cb(null, sharedProfileDir);
//   },
//   filename: (req: Request, file: Express.Multer.File, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${randomUUID()}${ext}`);
//   },
// });

// const audioStorage: StorageEngine = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, sharedAudioDir);
//   },
//   filename: (req: any, file, cb) => {
//     const ext = path.extname(file.originalname);
//     req.originalFileName = file.originalname;
//     req.savedFileName = `${randomUUID()}${ext}`;
//     cb(null, req.savedFileName);
//   },
// });

/* =====================================================
   ✅ CLOUD STORAGE (Supabase / Railway / Vercel)
   ใช้ memoryStorage แทน
   ===================================================== */

const memoryStorage = multer.memoryStorage();

/* =========================
   Upload Audio (WAV only)
   ========================= */
export const uploadAudio = multer({
  storage: memoryStorage, // 🔁 เปลี่ยนจาก audioStorage
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req: Request, file, cb: FileFilterCallback) => {
    const allowedMimeTypes = ["audio/wav", "audio/x-wav"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error("Only audio files (.wav) are allowed"));
      return;
    }

    cb(null, true);
  },
});

/* =========================
   Upload Avatar (Image only)
   ========================= */
export const uploadAvatar = multer({
  storage: memoryStorage, // 🔁 เปลี่ยนจาก storage
  limits: {
    fileSize: 1_000_000, // 1MB
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files"));
      return;
    }
    cb(null, true);
  },
});
