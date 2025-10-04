import { type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import { Site } from "../models/site.model.js";

// GET /site/dashboard
export const siteDashboard = async (req: Request, res: Response) => {
  try {
    // Example: fetch all sites with some stats
    const sites = await Site.find();
    const totalSites = sites.length;

    const totalUsers = await User.countDocuments();

    res.status(StatusCodes.OK).json({
      totalSites,
      totalUsers,
      sites,
    });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

// GET /site/team
export const getTeam = async (req: Request, res: Response) => {
  try {
    // Example: fetch all users
    const users = await User.find().select("-password"); // exclude passwords

    res.status(StatusCodes.OK).json(users);
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

// POST /site/team/add
export const addTeam = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, siteId, gender, designation } = req.body;

    if (!name || !email || !password || !role || !siteId || !gender || !designation) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({ message: "Email already exists" });
    }

    const hashedPassword = await import("bcryptjs").then(bcrypt => bcrypt.hash(password, 10));

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      siteId,
      gender,
      designation,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Team member added successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        siteId: user.siteId,
        gender: user.gender,
        designation: user.designation,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};
