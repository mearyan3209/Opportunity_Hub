import { Router, type IRouter } from "express";
import { Types } from "mongoose";
import { User } from "../models/User";
import { Opportunity } from "../models/Opportunity";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

// POST /api/user/save/:id  -> toggle save/unsave
router.post("/user/save/:id", requireAuth, async (req, res) => {
  try {
    const oppId = req.params.id;
    if (!Types.ObjectId.isValid(oppId)) {
      return res.status(400).json({ message: "Invalid opportunity id" });
    }
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const idx = user.savedOpportunities.findIndex(
      (o) => String(o) === String(oppId),
    );
    let saved: boolean;
    if (idx === -1) {
      user.savedOpportunities.push(new Types.ObjectId(oppId));
      saved = true;
    } else {
      user.savedOpportunities.splice(idx, 1);
      saved = false;
    }
    await user.save();
    return res.json({ saved, savedOpportunities: user.savedOpportunities });
  } catch (err) {
    req.log.error({ err }, "Save opportunity failed");
    return res.status(500).json({ message: "Failed to save opportunity" });
  }
});

// GET /api/user/saved
router.get("/user/saved", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user!.id).populate("savedOpportunities");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user.savedOpportunities);
  } catch (err) {
    req.log.error({ err }, "Saved list failed");
    return res.status(500).json({ message: "Failed to load saved" });
  }
});

// POST /api/user/progress
router.post("/user/progress", requireAuth, async (req, res) => {
  try {
    const { progress } = req.body || {};
    const value = Math.max(0, Math.min(100, Number(progress) || 0));
    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { progress: value },
      { new: true },
    ).select("-password");
    return res.json({ progress: user?.progress });
  } catch (err) {
    req.log.error({ err }, "Update progress failed");
    return res.status(500).json({ message: "Failed to update progress" });
  }
});

// GET /api/user/dashboard  -> combined dashboard summary
router.get("/user/dashboard", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user!.id).populate("savedOpportunities");
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    const saved = user.savedOpportunities as unknown as Array<{
      deadline: Date;
    }>;
    const upcomingDeadlines = saved.filter(
      (o) => new Date(o.deadline).getTime() > now.getTime(),
    ).length;

    const quizScores = user.quizScores;
    const avgScore =
      quizScores.length > 0
        ? Math.round(
            quizScores.reduce(
              (acc, q) => acc + (q.total > 0 ? (q.score / q.total) * 100 : 0),
              0,
            ) / quizScores.length,
          )
        : 0;

    // Simple recommendation logic by educationLevel
    let recommendCategories: string[] = [];
    switch (user.educationLevel) {
      case "School":
        recommendCategories = ["School Olympiad", "Scholarship"];
        break;
      case "Class 11-12":
        recommendCategories = ["UG Entrance", "Scholarship"];
        break;
      case "UG Aspirant":
        recommendCategories = ["UG Entrance", "Scholarship"];
        break;
      case "College Student":
        recommendCategories = ["College/Skill", "Internship", "Scholarship"];
        break;
    }

    const recommended = await Opportunity.find({
      category: { $in: recommendCategories },
      deadline: { $gte: now },
    })
      .sort({ deadline: 1 })
      .limit(6);

    const recent = await Opportunity.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      savedCount: user.savedOpportunities.length,
      upcomingDeadlines,
      avgScore,
      progress: user.progress,
      recommended,
      recent,
      quizScores: user.quizScores,
    });
  } catch (err) {
    req.log.error({ err }, "Dashboard failed");
    return res.status(500).json({ message: "Failed to load dashboard" });
  }
});

// Admin: list users
router.get("/user", requireAuth, async (req, res) => {
  if (req.user!.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return res.json(users);
});

export default router;
