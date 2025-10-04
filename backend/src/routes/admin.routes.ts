import { Router } from "express";
import {
  getAllSites,
  addSite,
  getTeamForSite,
  addTeamMember,
  verifyTree,
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/sites", getAllSites);
router.post("/sites/add", addSite);
router.get("/site/team", getTeamForSite);
router.post("/site/team/add", addTeamMember);
router.patch("/verify/:treeId", verifyTree);

export default router;