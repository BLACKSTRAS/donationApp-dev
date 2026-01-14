import { Request, Response } from "express";
import { getVoices, updateVoiceStatus, getVoiceByModelId } from "./voicesModel";
// import fs from "fs";
// import path from "path";

/* =====================================================
   List Voices (DB-only)
   ===================================================== */
export async function listVoices(req: Request, res: Response) {
  const search = String(req.query.search || "");
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  try {
    const data = await getVoices(search, page, limit);
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false });
  }
}

/* =====================================================
   Change Voice Status (DB-only)
   ===================================================== */
export async function changeVoiceStatus(req: Request, res: Response) {
  const id = Number(req.params.id);
  const status = Number(req.body.status);

  try {
    await updateVoiceStatus(id, status);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
}

/* =====================================================
   Play Voice (FILE) ❗
   ===================================================== */
export async function playVoice(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid voice id" });
  }

  try {
    const voice = await getVoiceByModelId(id);

    if (!voice || !voice.config_path) {
      return res.status(404).json({ message: "Voice not found" });
    }

    /* =========================
       ❌ LOCAL FILE SYSTEM (ของเดิม)
       ใช้ไม่ได้บน Railway / Cloud
       ========================= */
    // const filePath = path.resolve(
    //   process.cwd(),
    //   "..",
    //   "shared",
    //   "audios",
    //   "voiceRef",
    //   voice.config_path
    // );
    //
    // if (!fs.existsSync(filePath)) {
    //   return res.status(404).json({ message: "Audio file not found" });
    // }
    //
    // const ext = path.extname(voice.config_path).toLowerCase();
    // const mimeMap: Record<string, string> = {
    //   ".wav": "audio/wav",
    //   ".mp3": "audio/mpeg",
    //   ".ogg": "audio/ogg",
    // };
    //
    // res.setHeader("Content-Type", mimeMap[ext] || "audio/*");
    // res.setHeader("Accept-Ranges", "bytes");
    //
    // fs.createReadStream(filePath).pipe(res);

    /* =========================
       ✅ SUPABASE STORAGE (ใหม่)
       ========================= */
    const baseUrl = process.env.SUPABASE_PUBLIC_URL;
    const publicUrl = `${baseUrl}/storage/v1/object/public/media/voices/${voice.config_path}`;

    return res.redirect(publicUrl);
  } catch (err) {
    console.error("playVoice error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
