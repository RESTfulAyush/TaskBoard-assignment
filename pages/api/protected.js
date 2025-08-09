import { authenticate } from "../../lib/auth";

export default function handler(req, res) {
  const user = authenticate(req, res);
  if (!user) return;
  res.status(200).json({ message: "You have access!", user });
}
