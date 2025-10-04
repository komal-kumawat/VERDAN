import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import { Tree } from "../models/tree.model.js";
import { Site } from "../models/site.model.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { Response } from "express";

// GET /user/dashboard
export const userDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const treesCount = await Tree.countDocuments({ userId });
    const sitesCount = await Site.countDocuments();

    return res.status(StatusCodes.OK).json({
      message: "User Dashboard",
      stats: { treesCount, sitesCount },
    });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

// GET /user/profile
export const userProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

// PUT /user/profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const { name, gender, designation } = req.body;

    // Validate required fields (optional)
    if (!name && !gender && !designation) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "At least one field must be provided to update" });
    }

    const updateData: Partial<{ name: string; gender: string; designation: string }> = {};
    if (name) updateData.name = name;
    if (gender) updateData.gender = gender;
    if (designation) updateData.designation = designation;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

    res.status(StatusCodes.OK).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};


// GET /user/site/dashboard
export const userSiteDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const trees = await Tree.find({ userId }).populate("siteId", "name address");
    res.status(StatusCodes.OK).json({ trees });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

// PUT /user/site/dashboard/:id
export const UpdateDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const treeId = req.params.id;
    const updateData = req.body;

    const tree = await Tree.findByIdAndUpdate(treeId, updateData, { new: true });
    if (!tree) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Tree not found" });
    }

    res.status(StatusCodes.OK).json({ message: "Tree updated successfully", tree });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

// POST /user/site/dashboard/add
export const AddTree = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { TreeId, name, coordinates, status, remarks, image, siteId } = req.body;

    const tree = await Tree.create({
      TreeId,
      name,
      coordinates,
      status,
      remarks,
      image,
      siteId,
      userId,
    });

    res.status(StatusCodes.CREATED).json({ message: "Tree added successfully", tree });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};
