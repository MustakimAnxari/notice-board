import prisma from "@/lib/prisma";
import { validateNotice } from "@/lib/validateNotice";

// GET  /api/notices  -> list all notices, Urgent first (DB-level ordering)
// POST /api/notices  -> create a notice
export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: "desc" }, // "Urgent" > "Normal" alphabetically desc, puts Urgent first
          { publishDate: "desc" },
        ],
      });
      return res.status(200).json(notices);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch notices." });
    }
  }

  if (req.method === "POST") {
    const { valid, errors, data } = validateNotice(req.body);
    if (!valid) {
      return res.status(400).json({ error: "Validation failed.", fieldErrors: errors });
    }
    try {
      const notice = await prisma.notice.create({ data });
      return res.status(201).json(notice);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create notice." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
