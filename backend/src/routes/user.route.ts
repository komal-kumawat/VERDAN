import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { userDashboard, userProfile, userSiteDashboard, UpdateDashboard, AddTree , updateProfile } from "../controllers/user.controller.js";

const userRoute = Router();

userRoute.use(authMiddleware); // all routes after this will have req.user

userRoute.get("/dashboard", userDashboard);
userRoute.get("/profile", userProfile);
userRoute.put("/profile" , updateProfile);
userRoute.get("/site/dashboard", userSiteDashboard);
userRoute.put("/site/dashboard/:id", UpdateDashboard);
userRoute.post("/site/dashboard/add", AddTree);

export default userRoute;
