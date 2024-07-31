import express from "express";
import { refreshToken, signIn, signup, verifySignup } from "./auth.controller.js";
import { authMiddleware } from "../authMiddleware.js";

const AuthRouter = express.Router();

AuthRouter.post("/signup", signup);
AuthRouter.post("/signup/verify", verifySignup);
AuthRouter.post("/signin", signIn);
AuthRouter.post("/refresh",authMiddleware, refreshToken);

export { AuthRouter };
