import express from "express";
import { signup, login, logout } from "../controller/user.controller.js";
import { checkAuth } from "../middleware/auth.js";

const router = express.Router();

// /api/auth/register
router.post("/register", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", checkAuth, async (req, res) => {
    try {
        res.status(200).json({
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve user information"
        });
    }
});

export default router;