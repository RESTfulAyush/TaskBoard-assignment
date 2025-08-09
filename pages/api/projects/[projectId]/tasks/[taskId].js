import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import mongoose from "mongoose";
import joi from "joi";

export default async function handler(req, res) {
  const { projectId, taskId } = req.query;
  console.log("project id:", projectId);
  console.log("task id:", taskId);
  console.log("req:", req.method);
  await dbConnect();

  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(taskId)
  ) {
    return res.status(400).json({ error: "Invalid projectId or taskId" });
  }

  if (req.method === "GET") {
    try {
      const data = await Project.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
        {
          $project: {
            task: {
              $filter: {
                input: "$task",
                as: "task",
                cond: {
                  $eq: ["$$task._id", new mongoose.Types.ObjectId(taskId)],
                },
              },
            },
          },
        },
      ]);

      if (!data[0]?.task?.length) {
        return res.status(404).json({ error: true, message: "Task not found" });
      }

      return res.json(data[0].task[0]);
    } catch (error) {
      console.error("Error fetching task:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    const taskSchema = joi.object({
      title: joi.string().min(3).max(30).required(),
      description: joi.string().required(),
      priority: joi.string().valid("Low", "Medium", "High").optional(),
      stage: joi.string().valid("To do", "In Progress", "Done").required(),
    });

    const { error, value } = taskSchema.validate(req.body);
    if (error) return res.status(422).json(error);

    try {
      const updatedProject = await Project.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(projectId),
          "task._id": new mongoose.Types.ObjectId(taskId),
        },
        {
          $set: {
            "task.$.title": value.title,
            "task.$.description": value.description,
            ...(value.priority && { "task.$.priority": value.priority }),
            "task.$.updated_at": new Date(),
            "task.$.stage": value.stage,
          },
        },
        { new: true }
      );

      if (!updatedProject) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json({ message: "Task updated successfully", updatedProject });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", details: err });
    }
  }

  if (req.method === "DELETE") {
    try {
      const data = await Project.updateOne(
        { _id: new mongoose.Types.ObjectId(projectId) },
        { $pull: { task: { _id: new mongoose.Types.ObjectId(taskId) } } }
      );
      return res.json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
