import { Document } from "mongoose";
import { Schema, model } from "mongoose";

export interface ISite extends Document {
    name: string;
    address: string;
    avatar: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    status: "healthy"|"unhealthy";
}


const siteSchema = new Schema<ISite>(
    {
        name: {
            type: String,
            required: [true, "Site name is required"],
            trim: true,
        },
        address: {
            type: String,
            required: [true, "Address is required"],
        },
        avatar: {
            type: String,
            default: "", // optional, can store image URL
        },
        coordinates: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            },
        },
        status: {
            type: String,
            enum: ["healthy", "unhealthy"],
            default: "healthy",
        },
    },
    { timestamps: true }
);

export const Site = model<ISite>("Site", siteSchema);
