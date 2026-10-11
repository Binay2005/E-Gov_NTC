import express from "express";
import { signup, login, logout } from "../controller/user.controller.js";

const router = express.Router();

// /api/auth/signup
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;