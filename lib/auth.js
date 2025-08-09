// import { dbConnect } from "@/lib/mongodb";

// import Project from "@/models/Project";
// import { authenticate } from "@/lib/auth";

// export default async function handler(req, res) {
//   await dbConnect();

//   const user = authenticate(req, res);
//   if (!user) return; // stops here if not logged in

//   if (req.method === "GET") {
//     const projects = await Project.find({ user: user.id });
//     return res.status(200).json(projects);
//   }

//   if (req.method === "POST") {
//     const project = await Project.create({ ...req.body, user: user.id });
//     return res.status(201).json(project);
//   }

//   res.status(405).json({ message: "Method not allowed" });
// }

import jwt from "jsonwebtoken";

export function authenticate(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}
