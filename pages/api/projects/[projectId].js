// /api/projects/[projectId].js

import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { authenticate } from "@/lib/auth";

export default async function handler(req, res) {
  await dbConnect();

  const user = authenticate(req);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { projectId } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const project = await Project.findOne({
          _id: projectId,
          user: user.id,
        }).select("-__v -updatedAt");

        if (!project) {
          return res.status(404).json({ message: "Project not found" });
        }

        // Group tasks by stage for easier column rendering
        const groupedTasks = {
          todo: (project.task || []).filter(
            (t) => t.stage.toLowerCase() === "to do"
          ),
          inProgress: (project.task || []).filter(
            (t) => t.stage.toLowerCase() === "in progress"
          ),
          done: (project.task || []).filter(
            (t) => t.stage.toLowerCase() === "done"
          ),
        };

        return res.status(200).json({
          _id: project._id,
          title: project.title,
          description: project.description,
          tasks: groupedTasks,
          createdAt: project.createdAt,
        });
      } catch (error) {
        console.error("GET /api/projects/[projectId] error:", error);
        return res.status(500).json({ message: "Server error" });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
