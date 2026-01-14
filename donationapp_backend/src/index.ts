import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { pool } from "./common/constants/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

/* =========================
   Load ENV
   ========================= */
dotenv.config();

/* =========================
   Import routes
   ========================= */
import authRouter from "./services/auth/authRoutes";
import manageRouter from "./services/user/manage/manageRoute";
import donateHistoryRouter from "./services/user/histories/donateHistoryRoute";
import userInfoRoutes from "./services/user/userInfo/userInfoRoutes";
import accountRoute from "./services/user/account/accountRoute";
import voiceTrainingRoute from "./services/user/voiceTraining/voiceTrainingRoute";
import paymentInfoRoute from "./services/client/paymentInfo/paymentInfoRoute";
import paymentRoute from "./services/user/payment/paymentRoute";
import donationsRoute from "./services/admin/donations/donationsRoute";
import dashboardRoute from "./services/admin/dashboard/dashboardRoute";
import usersRoute from "./services/admin/users/usersRoute";
import voicesRoute from "./services/admin/voices/voicesRoute";
import widgetRoute from "./services/user/widget/widgetRoute";

const app = express();

/* =====================================================
   ❌ LOCAL CONFIG (ของเดิม)
   ===================================================== */
// const PORT = 8000;

/* =====================================================
   ✅ CLOUD / RAILWAY CONFIG
   ===================================================== */
const PORT = Number(process.env.PORT) || 8000;

/* =========================
   Middleware
   ========================= */

/* ❌ LOCAL CORS (ของเดิม) */
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

/* ✅ PRODUCTION CORS */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* =====================================================
   ❌ LOCAL STATIC FILE (PROFILE IMAGE)
   ===================================================== */
// app.use(
//   "/images/profiles",
//   express.static(
//     "C:/Users/supks/Documents/donationAppDev/shared/images/profiles"
//   )
// );

/* =====================================================
   NOTE:
   - Profile image / audio ใช้ Supabase Storage
   - ไม่ใช้ static local path บน production
   ===================================================== */

/* =========================
   API Routes
   ========================= */
app.use("/api/auth", authRouter);
app.use("/api/manage", manageRouter);
app.use("/api/user", userInfoRoutes);
app.use("/api/histories", donateHistoryRouter);
app.use("/api/account", accountRoute);
app.use("/api/voiceTraining", voiceTrainingRoute);
app.use("/api/paymentInfo", paymentInfoRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/widgetSetting", widgetRoute);
app.use("/api/admin/donations", donationsRoute);
app.use("/api/users", usersRoute);
app.use("/api/admin", dashboardRoute);
app.use("/api/admin/voices", voicesRoute);

/* =========================
   Health / DB Test
   ========================= */
app.get("/", async (_req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      db: "connected",
      env: process.env.NODE_ENV,
    });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: "DB connection failed" });
  }
});

/* =========================
   Static (optional)
   ========================= */
app.use(express.static(path.join(__dirname, "../public")));

/* =========================
   HTTP + Socket.IO
   ========================= */
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* =========================
   Socket.IO Logic
   ========================= */
io.on("connection", async (socket: Socket) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.warn("No widget token");
      return socket.disconnect();
    }

    const result = await pool.query(
      `SELECT steamer_id FROM steamers_user WHERE widget_token = $1`,
      [token]
    );

    if (!result.rowCount) {
      console.warn("Invalid widget token");
      return socket.disconnect();
    }

    const steamerId = result.rows[0].steamer_id;
    socket.join(`widget:${steamerId}`);

    console.log(`🔌 Widget connected → steamer ${steamerId}`);

    socket.on("disconnect", () => {
      console.log(`❌ Widget disconnected → steamer ${steamerId}`);
    });
  } catch (err) {
    console.error("Socket auth error:", err);
    socket.disconnect();
  }
});

/* =========================
   Emit Donation Event
   ========================= */
export function emitDonation(data: {
  steamerId: number;
  donate_by: string;
  amount: number;
  donate_details?: string;
  soundUrl?: string;
  preview?: boolean;
  widgetType?: number;
}) {
  io.to(`widget:${data.steamerId}`).emit("donationUpdate", {
    donate_by: data.donate_by,
    amount: data.amount,
    donate_details: data.donate_details,
    soundUrl: data.soundUrl,
    preview: data.preview,
    widgetType: data.widgetType,
  });
}

/* =========================
   Start Server
   ========================= */
server.listen(PORT, () => {
  console.log("================================");
  console.log("🚀 Server started");
  console.log(`🌍 ENV : ${process.env.NODE_ENV}`);
  console.log(`📡 PORT: ${PORT}`);
  console.log("================================");
});

/* =========================
   Graceful Shutdown (สำคัญ)
   ป้องกัน port ค้างเวลา dev/restart
   ========================= */
const shutdown = () => {
  console.log("🛑 Shutting down server...");
  server.close(() => {
    console.log("✅ HTTP server closed");
    pool.end().finally(() => {
      console.log("✅ DB pool closed");
      process.exit(0);
    });
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
