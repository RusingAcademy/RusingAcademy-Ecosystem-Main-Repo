import { Router } from "express";
import { getDb } from "../db";
import { apiKeyAuthMiddleware, requireScope } from "../middleware/apiKeyAuth";
import { featureFlagService } from "../services/featureFlagService";

const apiV1 = Router();

// All v1 routes require API key authentication
apiV1.use(apiKeyAuthMiddleware);

// Feature flag gate
apiV1.use(async (_req, res, next) => {
  const enabled = await featureFlagService.isEnabled("PUBLIC_API_ENABLED");
  if (!enabled) return res.status(503).json({ error: "Public API is currently disabled" });
  next();
});

// GET /api/v1/health
apiV1.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "1.0.0", timestamp: new Date().toISOString() });
});

// GET /api/v1/courses — List published courses
apiV1.get("/courses", requireScope("courses:read"), async (_req, res) => {
  try {
    const db = await getDb();
    const courses = await db.execute("SELECT id, title, slug, description, level, language, price, status, createdAt FROM courses WHERE status = 'published' LIMIT 100");
    res.json({ data: courses[0], count: (courses[0] as any[]).length });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// GET /api/v1/courses/:id — Get course details
apiV1.get("/courses/:id", requireScope("courses:read"), async (req, res) => {
  try {
    const db = await getDb();
    const [courses] = await db.execute(`SELECT id, title, slug, description, level, language, price, status, createdAt FROM courses WHERE id = ? LIMIT 1`, [req.params.id]);
    const course = (courses as any[])[0];
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json({ data: course });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

// GET /api/v1/learners — List learner profiles
apiV1.get("/learners", requireScope("learners:read"), async (_req, res) => {
  try {
    const db = await getDb();
    const learners = await db.execute("SELECT lp.id, u.firstName, u.lastName, u.email, lp.level, lp.targetExam, lp.createdAt FROM learner_profiles lp JOIN users u ON lp.userId = u.id LIMIT 100");
    res.json({ data: learners[0], count: (learners[0] as any[]).length });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch learners" });
  }
});

// GET /api/v1/sessions — List sessions
apiV1.get("/sessions", requireScope("sessions:read"), async (_req, res) => {
  try {
    const db = await getDb();
    const sessions = await db.execute("SELECT id, coachId, learnerId, scheduledAt, duration, sessionType, focusArea, status, price, createdAt FROM sessions ORDER BY scheduledAt DESC LIMIT 100");
    res.json({ data: sessions[0], count: (sessions[0] as any[]).length });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// GET /api/v1/memberships — List membership tiers
apiV1.get("/memberships", requireScope("memberships:read"), async (_req, res) => {
  try {
    const db = await getDb();
    const tiers = await db.execute("SELECT id, name, slug, price, billingCycle, features, isActive, createdAt FROM membership_tiers WHERE isActive = 1 LIMIT 50");
    res.json({ data: tiers[0], count: (tiers[0] as any[]).length });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch membership tiers" });
  }
});

export default apiV1;
