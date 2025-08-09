// pages/api/projects/[projectId]/tasks/index.js
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import mongoose from "mongoose";
import joi from "joi";

export default async function handler(req, res) {
  const { projectId } = req.query;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  if (req.method === "GET") {
    try {
      const project = await Project.findById(projectId, { task: 1, _id: 0 });
      if (!project)
        return res.status(404).json({ message: "Project not found" });
      return res.status(200).json(project.task);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }

  if (req.method === "POST") {
    const taskSchema = joi.object({
      title: joi.string().min(3).max(30).required(),
      description: joi.string().required(),
      priority: joi.string().valid("Low", "Medium", "High").required(),
    });

    const { error, value } = taskSchema.validate(req.body);
    if (error) return res.status(422).json(error);

    try {
      const project = await Project.findById(projectId, { task: 1 });
      if (!project)
        return res.status(404).json({ message: "Project not found" });

      const maxIndex =
        project.task.length > 0
          ? Math.max(...project.task.map((t) => t.index))
          : 0;

      project.task.push({
        ...value,
        stage: "To do",
        order: project.task.length,
        index: maxIndex + 1,
      });

      await project.save();

      return res.status(201).json({ message: "Task created successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }

  if (req.method === "PUT") {
    const taskSchema = joi.object({
      taskId: joi.string().required(),
      title: joi.string().min(3).max(30).required(),
      description: joi.string().required(),
      priority: joi.string().valid("Low", "Medium", "High").required(),
    });

    const { error, value } = taskSchema.validate(req.body);
    if (error) return res.status(422).json(error);

    try {
      const project = await Project.findOneAndUpdate(
        { _id: projectId, "task._id": value.taskId },
        {
          $set: {
            "task.$.title": value.title,
            "task.$.description": value.description,
            "task.$.priority": value.priority,
          },
        },
        { new: true }
      );

      if (!project) return res.status(404).json({ message: "Task not found" });

      return res.status(200).json({ message: "Task updated successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PUT"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
