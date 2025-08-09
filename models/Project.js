import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true },
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    task: [
      {
        id: Number,
        title: String,
        description: String,
        priority: {
          type: String,
          enum: ["Low", "Medium", "High"],
          required: true,
        },
        order: Number,
        stage: String,
        index: Number,
        attachment: [{ type: String, url: String }],
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
