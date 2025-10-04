import { Router } from "express";
import { addTeam, getTeam, siteDashboard } from "../controllers/admin.controller.js";

const adminRoute = Router();
adminRoute.get("/site/dashboard" , siteDashboard);
adminRoute.get("/site/team", getTeam);
adminRoute.post("/site/team/add" , addTeam);

export default adminRoute;