import express from "express";
import { signup, login, logout } from "../controller/user.controller.js";

const router = express.Router();

// /api/auth/register
router.post("/register", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;