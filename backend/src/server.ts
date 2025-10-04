import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/auth.routes.js";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json())
app.use(cors());
app.use("/auth" , AuthRoute);

mongoose.connect(MONGO_URI as string)
.then(()=>console.log("mongodb connected successfully"))
.catch((err)=>{
    console.log("error while connecting mongodb" , err);
})
app.listen(PORT , ()=>{
    console.log(`listening to port ${PORT}`);
})