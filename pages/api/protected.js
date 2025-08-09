import { authenticate } from "../../lib/auth";

export default function handler(req, res) {
  const user = authenticate(req, res);
  console.log("user:", user);
  if (!user) return; // authenticate already sent error response
  res.status(200).json({ message: "You have access!", user });
}
