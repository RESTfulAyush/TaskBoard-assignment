import joi from "joi";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { authenticate } from "@/lib/auth";

export default async function handler(req, res) {
  await dbConnect();

  const user = authenticate(req);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const data = await Project.find(
        { user: user.id },
        { __v: 0, updatedAt: 0 }
      );
      return res.status(200).json(data);
    } catch (error) {
      console.error("GET /api/projects error:", error);
      return res.status(500).json({ message: "Failed to fetch projects" });
    }
  }

  if (req.method === "POST") {
    const projectSchema = joi.object({
      title: joi.string().min(3).max(30).required(),
      description: joi.string().required(),
    });

    const { error, value } = projectSchema.validate(req.body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }

    try {
      const data = await new Project({ ...value, user: user.id }).save();
      return res.status(201).json({
        data: {
          title: data.title,
          description: data.description,
          updatedAt: data.updatedAt,
          _id: data._id,
        },
      });
    } catch (e) {
      if (e.code === 11000) {
        return res
          .status(422)
          .json({ error: true, message: "Title must be unique" });
      }
      console.error("POST /api/projects error:", e);
      return res.status(500).json({ error: true, message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
