import { Router, type IRouter } from "express";
import { Opportunity } from "../models/Opportunity";
import { requireAuth, requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

// GET /api/opportunities  (with filters: ?category=&level=&q=&time=upcoming|past)
router.get("/opportunities", async (req, res) => {
  try {
    const { category, level, q, time } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};
    if (category && category !== "all") filter.category = category;
    if (level && level !== "all") filter.level = level;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }
    if (time === "upcoming") {
      filter.deadline = { $gte: new Date() };
    } else if (time === "past") {
      filter.deadline = { $lt: new Date() };
    }

    const opps = await Opportunity.find(filter).sort({ deadline: 1 });
    return res.json(opps);
  } catch (err) {
    req.log.error({ err }, "List opportunities failed");
    return res.status(500).json({ message: "Failed to load opportunities" });
  }
});

// GET /api/opportunities/:id
router.get("/opportunities/:id", async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: "Opportunity not found" });
    return res.json(opp);
  } catch (err) {
    req.log.error({ err }, "Get opportunity failed");
    return res.status(400).json({ message: "Invalid opportunity id" });
  }
});

// POST /api/opportunities (admin)
router.post("/opportunities", requireAuth, requireAdmin, async (req, res) => {
  try {
    const created = await Opportunity.create(req.body);
    return res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Create opportunity failed");
    return res.status(400).json({ message: "Failed to create opportunity" });
  }
});

// PUT /api/opportunities/:id (admin)
router.put("/opportunities/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const updated = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Update opportunity failed");
    return res.status(400).json({ message: "Failed to update" });
  }
});

// DELETE /api/opportunities/:id (admin)
router.delete("/opportunities/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await Opportunity.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    return res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Delete opportunity failed");
    return res.status(400).json({ message: "Failed to delete" });
  }
});

export default router;
