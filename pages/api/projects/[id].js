import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (!id)
    return res.status(422).json({ error: true, message: "Id is required" });

  if (req.method === "GET") {
    try {
      const data = await Project.find({
        _id: mongoose.Types.ObjectId(id),
      }).sort({ order: 1 });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  if (req.method === "DELETE") {
    try {
      const data = await Project.deleteOne({
        _id: mongoose.Types.ObjectId(id),
      });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
