import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db";
import errorHandler from "./middleware/errorHandler";
import authenticate from "./middleware/authenticate";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import weddingRoute from "./routes/wedding.route";
import sessionRoutes from "./routes/session.route";
import contentRoutes from "./routes/content.route";
import imageRoutes from "./routes/image.route";
import audioRoutes from "./routes/audio.route";
import { APP_ORIGIN,ALLOWED_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import originCheck from "./middleware/originCheck";

const app = express();

// test setting/root config
// add middleware
// app_origin for dasboard, allowed_origin for client
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [APP_ORIGIN, ALLOWED_ORIGIN],
    credentials: true,
  })
);
app.use((req, res, next) => {
  console.log('CORS check - Origin:', req.headers.origin);
  next();
});
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "../public")));
// health check
app.get("/", (_, res) => {
  return res.status(200).json({
    status: `hello world.`,
  });
});
// auth routes
app.use("/auth", authRoutes);

// protected routes
app.use("/user", authenticate, userRoutes);
app.use("/sessions", authenticate, sessionRoutes);
//app.use("/dashboard", authenticate, dashboardRoutes);
app.use("/wedding", authenticate, weddingRoute);

//open routes
app.use("/content",contentRoutes);
app.use("/images", imageRoutes);
app.use("/audio", audioRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabase();
});
