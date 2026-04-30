import { Router, type IRouter } from "express";
import { Types } from "mongoose";
import { Opportunity } from "../models/Opportunity";
import { User } from "../models/User";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

// GET /api/quiz/:opportunityId
router.get("/quiz/:opportunityId", async (req, res) => {
  try {
    const oppId = req.params.opportunityId;
    if (!Types.ObjectId.isValid(oppId)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const opp = await Opportunity.findById(oppId).select("title quiz");
    if (!opp) return res.status(404).json({ message: "Not found" });
    // Strip answers when sending to client
    const safeQuiz = opp.quiz.map((q, i) => ({
      index: i,
      question: q.question,
      options: q.options,
    }));
    return res.json({ title: opp.title, quiz: safeQuiz });
  } catch (err) {
    req.log.error({ err }, "Get quiz failed");
    return res.status(500).json({ message: "Failed to load quiz" });
  }
});

// POST /api/quiz/submit
// body: { opportunityId, answers: number[] }
router.post("/quiz/submit", requireAuth, async (req, res) => {
  try {
    const { opportunityId, answers } = req.body || {};
    if (!Types.ObjectId.isValid(opportunityId)) {
      return res.status(400).json({ message: "Invalid opportunity id" });
    }
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "answers must be an array" });
    }
    const opp = await Opportunity.findById(opportunityId);
    if (!opp) return res.status(404).json({ message: "Opportunity not found" });

    let score = 0;
    const total = opp.quiz.length;
    const review = opp.quiz.map((q, i) => {
      const userAnswer = typeof answers[i] === "number" ? answers[i] : -1;
      const correct = userAnswer === q.answer;
      if (correct) score += 1;
      return {
        question: q.question,
        options: q.options,
        userAnswer,
        correctAnswer: q.answer,
        correct,
      };
    });

    const user = await User.findById(req.user!.id);
    if (user) {
      user.quizScores.push({
        opportunityId: opp._id as Types.ObjectId,
        score,
        total,
        takenAt: new Date(),
      });
      // Bump progress a bit on quiz completion
      const newProgress = Math.min(100, (user.progress || 0) + 5);
      user.progress = newProgress;
      await user.save();
    }

    return res.json({ score, total, review });
  } catch (err) {
    req.log.error({ err }, "Submit quiz failed");
    return res.status(500).json({ message: "Failed to submit quiz" });
  }
});

export default router;
