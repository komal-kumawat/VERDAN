import { Document, Schema, model, Types } from "mongoose";

export interface ITree extends Document {
  TreeId: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  date: Date;
  status: "healthy" | "unhealthy";
  remarks: string;
  image: string;       
  siteId: Types.ObjectId;
  userId: Types.ObjectId;
}

const treeSchema = new Schema<ITree>(
  {
    TreeId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["healthy", "unhealthy"], default: "healthy" },
    remarks: { type: String, default: "" },
    image: { type: String, default: "" },
    siteId: { type: Schema.Types.ObjectId, ref: "Site", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Tree = model<ITree>("Tree", treeSchema);
