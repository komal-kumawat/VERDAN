import { Router } from "express";
import { authMiddleware, requireAdmin } from "../middleware/auth.middleware.js";
import { getMe, signin, signup } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", requireAdmin, signup);
router.post("/signin", signin);
router.get("/me", authMiddleware, getMe);

export default router;