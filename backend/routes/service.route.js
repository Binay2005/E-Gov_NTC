
import express from "express";
import { getServices } from "../controller/service.controller.js";
import { checkAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", checkAuth, getServices);

export default router;
