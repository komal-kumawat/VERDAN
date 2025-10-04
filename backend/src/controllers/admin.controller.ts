import { type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import { Site } from "../models/site.model.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/email.utils.js";

// GET /site/dashboard
export const siteDashboard = async (req: Request, res: Response) => {
  try {
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
    const users = await User.find().select("-password");
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
      // Update existing user's site or role if needed
      existingUser.siteId = siteId;
      existingUser.role = role;
      await existingUser.save();

      // Send email notification
      await sendEmail(
        existingUser.email,
        "New Site Assignment",
        `
          <h2>Hello ${existingUser.name}!</h2>
          <p>You have been assigned to a new site/admin.</p>
          <p><strong>Email:</strong> ${existingUser.email}</p>
          <p><strong>Assigned Role:</strong> ${existingUser.role}</p>
        `
      );

      return res.status(StatusCodes.OK).json({
        message: "Existing user assigned to new site/admin and email sent",
        user: existingUser,
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      siteId,
      gender,
      designation,
    });

    // Send email with login credentials
    await sendEmail(
      email,
      "Welcome to the Team!",
      `
        <h2>Hello ${name}!</h2>
        <p>Your account has been created.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p><strong>Role:</strong> ${role}</p>
      `
    );

    res.status(StatusCodes.CREATED).json({
      message: "Team member added successfully and email sent",
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
