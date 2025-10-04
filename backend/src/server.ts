import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import adminRoute from "./routes/admin.routes.js";
import userRoute from "./routes/user.routes.js";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json())
app.use(cors());
app.use("/auth" , userRoute);
// app.use("/api/v0/admin",adminRoute);

mongoose.connect(MONGO_URI as string)
.then(()=>console.log("mongodb connected successfully"))
.catch((err)=>{
    console.log("error while connecting mongodb" , err);
})
app.listen(PORT , ()=>{
    console.log(`listening to port ${PORT}`);
})