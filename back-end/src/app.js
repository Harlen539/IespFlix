import express from "express";
import cors from "cors";
import catalogRoutes from "./routes/catalogRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

const allowedOrigins = [
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.some((allowedOrigin) => allowedOrigin.test(origin))) {
      callback(null, true);
      return;
    }

    callback(new Error("Origem não permitida pelo CORS"));
  }
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "IESPFLIX API",
    status: "online"
  });
});

app.use("/api/catalog", catalogRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;
