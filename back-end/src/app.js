import express from "express";
import cors from "cors";
import catalogRoutes from "./routes/catalogRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "IESPFLIX API",
    status: "online"
  });
});

app.use("/api/catalog", catalogRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;
