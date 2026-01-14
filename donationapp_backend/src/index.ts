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

/* =========================
   App / Server
   ========================= */
const app = express();
const server = http.createServer(app);

/* =========================
   🔴 TRUST PROXY (สำคัญที่สุด)
   =========================
   Railway / HTTPS / Secure Cookie
*/
app.set("trust proxy", 1);

/* =========================
   ENV / PORT
   ========================= */
const PORT = Number(process.env.PORT) || 8000;
const FRONTEND_ORIGIN = "https://donation-app-dev.vercel.app";

/* =========================
   Middleware
   ========================= */

/**
 * ✅ CORS (ของคุณถูกแล้ว)
 * - ห้ามใช้ *
 * - ต้อง credentials: true
 */
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use("/api/admin/users", usersRoute);
app.use("/api/admin", dashboardRoute);
app.use("/api/admin/voices", voicesRoute);

/* =========================
   Health Check
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
   Socket.IO
   ========================= */
export const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    credentials: true,
  },
});

/* =========================
   Socket Auth
   ========================= */
io.on("connection", async (socket: Socket) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.warn("❌ No widget token");
      return socket.disconnect();
    }

    const result = await pool.query(
      `SELECT steamer_id FROM steamers_user WHERE widget_token = $1`,
      [token]
    );

    if (!result.rowCount) {
      console.warn("❌ Invalid widget token");
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
   Emit Donation
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
   Graceful Shutdown
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
