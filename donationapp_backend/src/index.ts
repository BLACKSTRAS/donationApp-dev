import express, { Request, Response } from "express";
import http from "http"; // ต้อง import http
import { Server, Socket } from "socket.io"; // import socket.io
import { pool } from "./common/constants/db";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import routes
import authRouter from "./services/auth/authRoutes";
import manageRouter from "./services/user/manage/manageRoute";
import donateHistoryRouter from "./services/user/histories/donateHistoryRoute";
import userInfoRoutes from "./services/user/userInfo/userInfoRoutes";
import accountRoute from "./services/user/account/accountRoute";
import voiceTrainingRoute from "./services/user/voiceTraining/voiceTrainingRoute";
import paymentInfoRoute from "./services/client/paymentInfo/paymentInfoRoute";
import paymentRoute from "./services/user/payment/paymentRoute";
import path from "path";
import donationsRoute from "./services/admin/donations/donationsRoute";
import dashboardRoute from "./services/admin/dashboard/dashboardRoute";
import usersRoute from "./services/admin/users/usersRoute";
import voicesRoute from "./services/admin/voices/voicesRoute";
import widgetRoute from './services/user/widget/widgetRoute';

const app = express();
const PORT = 8000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(
  "/images/profiles",
  express.static(
   "C:\\Users\\black\\Desktop\\donationApp\\shared\\images\\profiles"
  )
);

app.use("/api/auth", authRouter);
app.use("/api/manage", manageRouter);
app.use("/api/user", userInfoRoutes);
app.use("/api/histories", donateHistoryRouter);
app.use("/api/account", accountRoute);
app.use("/api/voiceTraining", voiceTrainingRoute);
app.use("/api/paymentInfo", paymentInfoRoute);
app.use("/api/payment", paymentRoute);
app.use('/api/widgetSetting', widgetRoute)
app.use("/api/admin/donations", donationsRoute);
app.use("/api/users", usersRoute);
app.use("/api/admin", dashboardRoute);
app.use("/api/admin/voices", voicesRoute);


app.get("/", async (req: Request, res: Response) => {
  try {
    await pool.connect();
    console.log("DB connected");
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err: any) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ====== Setup HTTP server + Socket.IO ======
app.use(express.static(path.join(__dirname, "../public")));
const server = http.createServer(app); // สร้าง HTTP server จาก Express

export const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

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
            console.warn(" Invalid widget token");
            return socket.disconnect();
        }

        const steamerId = result.rows[0].steamer_id;

        socket.join(`widget:${steamerId}`);

        console.log(`Widget connected → steamer ${steamerId}`);

        socket.on("disconnect", () => {
            console.log(`Widget disconnected → steamer ${steamerId}`);
        });

    } catch (err) {
        console.error("Socket auth error:", err);
        socket.disconnect();
    }
});
// Function ส่งโดเนทไป client
export function emitDonation(data: {
    steamerId: number;
    donate_by: string;
    amount: number;
    donate_details?: string;
    soundUrl?: string;
    preview?:boolean;
    widgetType?:number;
}) {
    io.to(`widget:${data.steamerId}`).emit("donationUpdate", {
        donate_by: data.donate_by,
        amount: data.amount,
        donate_details: data.donate_details,
        soundUrl: data.soundUrl,
        preview:data?.preview,
        widgetType:data?.widgetType
    });
}

// Start server
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});



