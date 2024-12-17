import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import { ALLOWED_ORIGIN } from "../constants/env";

const allowedOrigins = [ALLOWED_ORIGIN]; // Ganti dengan domain landing page Anda

const originCheck: RequestHandler = (req, res, next) => {
  const origin = req.get("origin") || req.get("referer");
  
  // Verifikasi apakah origin/referer diizinkan
  appAssert(
    origin && allowedOrigins.some((allowed) => origin.startsWith(allowed)),
    UNAUTHORIZED,
    "Access denied. Origin not allowed."
  );

  next();
};

export default originCheck;