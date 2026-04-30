import { Router, type IRouter } from "express";
import { User } from "../models/User";
import { hashPassword, comparePassword, signToken } from "../lib/auth";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

// POST /api/auth/register
router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, educationLevel } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      educationLevel: educationLevel || "College Student",
    });

    const token = signToken({ id: String(user._id), role: user.role });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        educationLevel: user.educationLevel,
        progress: user.progress,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Register failed");
    return res.status(500).json({ message: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const ok = await comparePassword(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ id: String(user._id), role: user.role });
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        educationLevel: user.educationLevel,
        progress: user.progress,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    return res.status(500).json({ message: "Login failed" });
  }
});

// GET /api/auth/me
router.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user!.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      educationLevel: user.educationLevel,
      progress: user.progress,
      savedOpportunities: user.savedOpportunities,
      quizScores: user.quizScores,
    });
  } catch (err) {
    req.log.error({ err }, "Me failed");
    return res.status(500).json({ message: "Failed to fetch user" });
  }
});

export default router;
