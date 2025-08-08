import jwt from "jsonwebtoken";

export function authenticate(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // { id, email }
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    return null;
  }
}
